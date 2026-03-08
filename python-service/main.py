"""
Scene3D Image Processing Microservice
FastAPI + OpenCV - Reemplaza imageProcessor.js del backend Node.js

Ventajas sobre Node.js:
- cv2.findContours con RETR_CCOMP: jerarquía padre/hueco nativa
- Otsu automático dentro de región no-fondo
- Morfología con kernel elíptico (más natural que cuadrado)
- Douglas-Peucker + Gaussian smoothing para contornos perfectos
"""

import cv2
import numpy as np
from scipy.ndimage import gaussian_filter1d
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import base64
import httpx
import time
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
log = logging.getLogger(__name__)

app = FastAPI(title="Scene3D Image Processor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_SIZE = 600


# ─── Image loading ─────────────────────────────────────────────────────────────

def load_image(data: bytes) -> np.ndarray:
    arr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen")

    # Ensure at least 3 channels
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    h, w = img.shape[:2]
    if max(h, w) > MAX_SIZE:
        scale = MAX_SIZE / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    return img


# ─── Background detection ──────────────────────────────────────────────────────

def detect_background(img_bgr: np.ndarray):
    h, w = img_bgr.shape[:2]
    step = 5
    border = np.concatenate([
        img_bgr[0, ::step],
        img_bgr[h - 1, ::step],
        img_bgr[::step, 0],
        img_bgr[::step, w - 1],
    ]).astype(np.float32)

    rounded = (border // 10) * 10
    unique, counts = np.unique(rounded.reshape(-1, 3), axis=0, return_counts=True)
    bg_bgr = unique[np.argmax(counts)].astype(np.uint8)

    diffs = np.abs(border - bg_bgr.astype(np.float32))
    variance = np.mean(diffs)
    tolerance = float(np.clip(variance * 1.5, 30, 80))

    bg_lum = 0.299 * bg_bgr[2] + 0.587 * bg_bgr[1] + 0.114 * bg_bgr[0]
    log.info(f"   BG BGR={bg_bgr} lum={bg_lum:.0f} tol={tolerance:.1f}")
    return bg_bgr, tolerance, bg_lum


def has_real_transparency(img_bgra: np.ndarray) -> bool:
    alpha = img_bgra[:, :, 3]
    transparent_ratio = np.sum(alpha < 255) / alpha.size
    return transparent_ratio > 0.05


# ─── Mask strategies ───────────────────────────────────────────────────────────

def alpha_mask(img_bgra: np.ndarray) -> np.ndarray:
    return (img_bgra[:, :, 3] > 100).astype(np.uint8) * 255


def color_distance_mask(img_bgr: np.ndarray, bg_bgr: np.ndarray, tolerance: float) -> np.ndarray:
    diff = img_bgr.astype(np.float32) - bg_bgr.astype(np.float32)
    dist = np.sqrt(np.sum(diff ** 2, axis=2))
    return (dist > tolerance).astype(np.uint8) * 255


def bright_adaptive_mask(img_bgr: np.ndarray, blur_sigma: float = 2.5,
                          block_size: int = 61, C: int = -15) -> np.ndarray:
    """
    Detecta píxeles MÁS BRILLANTES que su vecindad local (Gaussian-weighted).
    Equivalente OpenCV del bright adaptive de Node.js (factor=1.15, window=30).

    block_size=61 → radio ~30px (= Node.js windowSize=30)
    C=-15 → pixel > local_mean + 15  ≈  pixel > local_mean * 1.15 para mean~100

    Ventajas vs Otsu global:
    - Los biseles del borde de placa (lum ~150) NO se detectan porque su vecindad
      también es brillante (fondo gris ~220) → mean alto → umbral alto → no pasa
    - Las letras metálicas (lum ~180-220) SÍ se detectan porque su vecindad es la
      placa oscura (~70) → mean bajo → umbral bajo → pasa con margen amplio
    """
    ksize = int(blur_sigma * 3) * 2 + 1
    blurred = cv2.GaussianBlur(img_bgr, (ksize, ksize), blur_sigma)
    gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)

    # blockSize debe ser impar
    bs = block_size if block_size % 2 == 1 else block_size + 1
    # MEAN_C = promedio plano (equivalente al Node.js integral image)
    # Con Gaussian, los píxeles del INTERIOR de una letra comparan contra
    # sus propios vecinos brillantes → threshold alto → no detectados.
    # Con Media plana, el promedio incluye placa oscura en los bordes del window
    # → threshold más bajo → detecta la mitad brillante del interior de cada letra.
    mask = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                 cv2.THRESH_BINARY, bs, C)

    ratio = np.sum(mask > 0) / mask.size
    log.info(f"   Bright adaptive: blockSize={bs} C={C} ratio={ratio * 100:.1f}%")
    return mask


def adaptive_dark_mask(img_bgr: np.ndarray) -> np.ndarray:
    """Umbral adaptativo para fondo oscuro con zonas más oscuras aún (sombras)."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    return cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                 cv2.THRESH_BINARY_INV, 51, 8)


def neon_mask(img_bgr: np.ndarray, threshold: int = 80) -> np.ndarray:
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    return mask


# ─── Morphology ────────────────────────────────────────────────────────────────

def apply_closing(mask: np.ndarray, kernel_size: int = 7) -> np.ndarray:
    """Closing con kernel elíptico: rellena huecos dentro de letras."""
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    return cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)


def apply_opening(mask: np.ndarray, kernel_size: int = 3) -> np.ndarray:
    """Opening: elimina speckle noise."""
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)


# ─── Contour detection ─────────────────────────────────────────────────────────

def find_contours_with_holes(mask: np.ndarray, min_area=200, max_area_ratio=0.50,
                              max_shapes=15, min_hole_area=300, max_holes=40):
    """
    cv2.RETR_CCOMP: jerarquía 2 niveles.
    - Nivel 0 (parent==-1): contornos externos
    - Nivel 1 (parent>=0): huecos del contorno padre
    Mucho más preciso que el marching squares manual del Node.js.
    """
    h, w = mask.shape
    max_area = w * h * max_area_ratio

    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hierarchy is None or len(contours) == 0:
        return []

    hierarchy = hierarchy[0]  # shape: (N, 4) → [next, prev, first_child, parent]

    shapes = []
    for i, contour in enumerate(contours):
        if hierarchy[i][3] != -1:
            continue  # es un hueco, no contorno externo

        area = cv2.contourArea(contour)
        if area < min_area or area > max_area:
            continue

        # Recopilar huecos: hijos directos de este contorno
        holes = []
        j = hierarchy[i][2]  # primer hijo
        while j != -1:
            hole_area = cv2.contourArea(contours[j])
            if hole_area >= min_hole_area:
                holes.append(contours[j])
            j = hierarchy[j][0]  # siguiente hermano

        holes = sorted(holes, key=cv2.contourArea, reverse=True)[:max_holes]
        shapes.append({'contour': contour, 'holes': holes, 'area': area})

    shapes.sort(key=lambda x: x['area'], reverse=True)
    log.info(f"   Contours: {len(shapes)} shapes (before max_shapes limit)")
    return shapes[:max_shapes]


# ─── Contour smoothing ─────────────────────────────────────────────────────────

def smooth_contour(contour: np.ndarray, epsilon_factor: float = 0.003,
                   gauss_sigma: float = 1.5) -> np.ndarray:
    """
    1. Douglas-Peucker: simplifica eliminando puntos redundantes (preserva forma)
    2. Gaussian circular: suaviza esquinas abruptas (ruido de textura/píxel)
    Resultado: curvas limpias similares a Bézier sin perder la forma de la letra.
    """
    if len(contour) < 4:
        return contour

    # Douglas-Peucker simplification
    perimeter = cv2.arcLength(contour, True)
    epsilon = epsilon_factor * perimeter
    simplified = cv2.approxPolyDP(contour, epsilon, True)
    pts = simplified.reshape(-1, 2).astype(np.float64)

    if len(pts) < 4:
        return simplified

    # Gaussian smoothing circular (el contorno es cerrado → wrap padding)
    pad = min(len(pts), int(gauss_sigma * 4) + 2)
    x_pad = np.concatenate([pts[-pad:, 0], pts[:, 0], pts[:pad, 0]])
    y_pad = np.concatenate([pts[-pad:, 1], pts[:, 1], pts[:pad, 1]])

    x_smooth = gaussian_filter1d(x_pad, sigma=gauss_sigma)[pad:-pad]
    y_smooth = gaussian_filter1d(y_pad, sigma=gauss_sigma)[pad:-pad]

    result = np.column_stack([x_smooth, y_smooth]).astype(np.float32)
    return result.reshape(-1, 1, 2)


# ─── Color sampling ────────────────────────────────────────────────────────────

def get_contour_color(contour: np.ndarray, img_bgr: np.ndarray) -> str:
    """Color promedio dentro del contorno usando máscara exacta (más preciso que bbox sampling)."""
    h, w = img_bgr.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    pts = contour.reshape(-1, 1, 2).astype(np.int32)
    cv2.drawContours(mask, [pts], 0, 255, -1)
    mean = cv2.mean(img_bgr, mask=mask)
    b, g, r = int(mean[0]), int(mean[1]), int(mean[2])
    return f'#{r:02x}{g:02x}{b:02x}'


def color_luminance(hex_color: str) -> float:
    h = hex_color.lstrip('#')
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return 0.299 * r + 0.587 * g + 0.114 * b


# ─── Main pipeline ─────────────────────────────────────────────────────────────

def process_pipeline(img_data: bytes, relief: float = 5.0,
                     is_neon_hint: Optional[bool] = None) -> dict:
    t0 = time.time()

    img = load_image(img_data)
    h, w = img.shape[:2]
    img_bgr = img[:, :, :3].copy()

    log.info(f"   Dimensions: {w}×{h}px")

    # ── 1. Crear máscara binaria ───────────────────────────────────────────────
    mask_mode = ''
    is_neon = False

    if has_real_transparency(img):
        mask = alpha_mask(img)
        mask_mode = 'alpha'
        log.info("   Mask: alpha channel")
    else:
        bg_bgr, tolerance, bg_lum = detect_background(img_bgr)
        non_bg = color_distance_mask(img_bgr, bg_bgr, tolerance)
        non_bg_bool = non_bg > 0
        non_bg_ratio = float(np.sum(non_bg_bool)) / (w * h)
        log.info(f"   Non-bg ratio: {non_bg_ratio * 100:.1f}%")

        # Detectar neón: fondo muy oscuro
        is_neon = bool(bg_bgr[0] < 80 and bg_bgr[1] < 80 and bg_bgr[2] < 80)
        if is_neon_hint is not None:
            is_neon = is_neon_hint

        if is_neon:
            mask = neon_mask(img_bgr, threshold=80)
            mask_mode = 'neon'
            log.info("   Mask: neon (dark bg)")
        elif non_bg_ratio > 0.30 and bg_lum > 150:
            # CASO PRINCIPAL: render 3D con fondo claro (corporea.png)
            # Umbral adaptativo LOCAL: cada píxel comparado con su vecindad de 30px.
            # Letras metálicas (lum~200) sobre placa oscura (mean~70) → ratio alto → detectadas.
            # Biseles de placa (lum~150) sobre fondo claro (mean~210) → ratio bajo → NO detectados.
            log.info("   Strategy: bright adaptive (light bg 3D render)")
            mask = bright_adaptive_mask(img_bgr, blur_sigma=2.5, block_size=61, C=-15)
            ratio_check = np.sum(mask > 0) / mask.size

            # Ajuste automático: si hay demasiados objetos, hacer C más estricto
            if ratio_check > 0.30:
                log.info(f"   Ratio alto ({ratio_check*100:.1f}%) → probando C=-25")
                mask = bright_adaptive_mask(img_bgr, blur_sigma=2.5, block_size=61, C=-25)
            elif ratio_check < 0.03:
                log.info(f"   Ratio bajo ({ratio_check*100:.1f}%) → probando C=-8")
                mask = bright_adaptive_mask(img_bgr, blur_sigma=2.5, block_size=61, C=-8)

            mask_mode = 'bright-adaptive'
        elif non_bg_ratio > 0.30:
            # Fondo oscuro, demasiados objetos → adaptativo oscuro
            mask = adaptive_dark_mask(img_bgr)
            mask_mode = 'adaptive-dark'
            log.info("   Mask: adaptive dark")
        else:
            mask = non_bg
            mask_mode = 'color-bg'
            log.info("   Mask: color distance")

    # ── 2. Morfología ──────────────────────────────────────────────────────────
    if not is_neon:
        if mask_mode == 'bright-adaptive':
            # closing(3): rellena huecos de 1-2px dentro de cada letra detectada
            # (los highlights metálicos crean pequeñas variaciones que closing cierra)
            # NO usar kernel grande → fusionaría letras adyacentes
            mask = apply_closing(mask, kernel_size=3)
            log.info("   Morphology: close(3,ellipse)")
        elif mask_mode == 'adaptive-dark':
            mask = apply_closing(mask, kernel_size=5)
            log.info("   Morphology: close(5,ellipse)")
        else:
            mask = apply_closing(mask, kernel_size=5)
            log.info("   Morphology: close(5,ellipse)")

    log.info(f"   Mask done: {(time.time() - t0) * 1000:.0f}ms")

    # ── 3. Detectar contornos con jerarquía ────────────────────────────────────
    t2 = time.time()
    min_area = 30 if is_neon else 200
    max_shapes = 20 if is_neon else 15

    raw_shapes = find_contours_with_holes(
        mask,
        min_area=min_area,
        max_area_ratio=0.50,
        max_shapes=max_shapes,
        min_hole_area=300,
        max_holes=40,
    )
    log.info(f"   Contours: {len(raw_shapes)} shapes | {(time.time() - t2) * 1000:.0f}ms")

    # ── 4. Escala 3D ───────────────────────────────────────────────────────────
    aspect = w / h
    base_size = 6.0
    width3D = base_size if aspect >= 1 else base_size * aspect
    height3D = base_size / aspect if aspect >= 1 else base_size
    depth = (0.2 + relief * 0.03) if is_neon else (relief * 0.08)
    scale_x = width3D / w
    scale_y = height3D / h

    # ── 5. Suavizar y convertir a coordenadas 3D ───────────────────────────────
    t4 = time.time()
    contours_out = []

    for idx, shape in enumerate(raw_shapes):
        raw = shape['contour']

        # Suavizado: Douglas-Peucker + Gaussian circular
        smoothed = smooth_contour(raw, epsilon_factor=0.002, gauss_sigma=1.5)
        pts = smoothed.reshape(-1, 2)

        if len(pts) < 3:
            continue

        # Convertir a coordenadas 3D (centro en 0,0)
        points = [
            {'x': round((float(p[0]) - w / 2) * scale_x, 4),
             'y': round(-(float(p[1]) - h / 2) * scale_y, 4)}
            for p in pts
        ]

        # Huecos
        holes_out = []
        for hole in shape['holes']:
            sh = smooth_contour(hole, epsilon_factor=0.002, gauss_sigma=1.2)
            hp = sh.reshape(-1, 2)
            if len(hp) < 3:
                continue
            holes_out.append([
                {'x': round((float(p[0]) - w / 2) * scale_x, 4),
                 'y': round(-(float(p[1]) - h / 2) * scale_y, 4)}
                for p in hp
            ])

        # Color promedio dentro del contorno
        color = get_contour_color(raw, img_bgr)

        # Filtrar fragmentos de fondo (color demasiado brillante = bleedthrough)
        lum = color_luminance(color)
        if lum > 210:
            log.info(f"   ⛔ Skipped shape[{idx}]: {color} lum={lum:.0f} (background bleedthrough)")
            continue

        area = int(shape['area'])
        log.info(f"   shape[{idx}]: {len(raw)}pts → {len(pts)}pts | holes:{len(holes_out)} | {color} | area:{area}")

        contours_out.append({
            'id': len(contours_out),
            'points': points,
            'holes': holes_out,
            'color': color,
            'area': area,
        })

    log.info(f"   Smoothing done: {(time.time() - t4) * 1000:.0f}ms")
    log.info(f"   Total: {(time.time() - t0) * 1000:.0f}ms | shapes: {len(contours_out)}")

    return {
        'success': True,
        'data': {
            'contours': contours_out,
            'width': w,
            'height': h,
            'width3D': round(width3D, 4),
            'height3D': round(height3D, 4),
            'depth': round(depth, 4),
            'isNeon': is_neon,
            'relief': relief,
            'totalShapes': len(contours_out),
        }
    }


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "scene3d-python"}


@app.post("/process")
async def process_endpoint(
    image: Optional[UploadFile] = File(None),
    imageUrl: Optional[str] = Form(None),
    imageBase64: Optional[str] = Form(None),
    relief: float = Form(5.0),
    isNeon: Optional[str] = Form(None),
):
    t0 = time.time()
    log.info("\n" + "─" * 50)
    log.info("🐍 [Scene3D Python] Nueva petición")

    img_data = None

    if image and image.filename:
        img_data = await image.read()
        log.info(f"   Source: file | {len(img_data) / 1024:.1f} KB | {image.content_type}")
    elif imageUrl:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(imageUrl)
            img_data = resp.content
        log.info(f"   Source: URL | {len(img_data) / 1024:.1f} KB")
    elif imageBase64:
        b64 = imageBase64.split(',', 1)[-1] if ',' in imageBase64 else imageBase64
        img_data = base64.b64decode(b64)
        log.info(f"   Source: base64 | {len(img_data) / 1024:.1f} KB")
    else:
        return {"success": False, "error": "Se requiere image (file), imageUrl o imageBase64"}

    is_neon_hint = None
    if isNeon is not None:
        is_neon_hint = isNeon.lower() == 'true'

    log.info(f"   Params: relief={relief} | isNeon={is_neon_hint}")

    try:
        result = process_pipeline(img_data, relief=relief, is_neon_hint=is_neon_hint)
        log.info(f"   ✅ Done in {(time.time() - t0) * 1000:.0f}ms")
        log.info("─" * 50 + "\n")
        return result
    except Exception as e:
        import traceback
        log.error(f"   ❌ Error: {e}")
        traceback.print_exc()
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
