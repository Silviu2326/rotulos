import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer las APIs del archivo
const apisData = JSON.parse(fs.readFileSync("./apis.json", "utf8"));
const API_KEYS = apisData.filter((key) => key && typeof key === "string");

// Configuración
const OUTPUT_DIR = path.join(__dirname, "public", "images", "rotulos");
const MODEL = "gemini-2.5-flash-image"; // Modelo de generación de imágenes

// Asegurar que el directorio existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Prompts para cada tipo de imagen
const imagePrompts = {
  banners: [
    {
      filename: "banner-1.jpg",
      prompt:
        'Professional illuminated signboard for a signage company, modern LED channel letters spelling "ROTULOS" on a dark storefront at night, purple and white neon glow, professional photography, high quality, commercial signage',
    },
    {
      filename: "banner-2.jpg",
      prompt:
        "Creative signage workshop interior, vinyl cutting machine working on colorful sticker materials, professional printing equipment, organized workspace, purple accent lighting, modern industrial aesthetic",
    },
    {
      filename: "banner-3.jpg",
      prompt:
        "Large format digital printing machine printing a colorful banner, professional sign making equipment, vibrant colors, modern print shop, clean workspace with purple branding elements",
    },
  ],
  productos: [
    {
      filename: "producto-1.jpg",
      prompt:
        'Professional illuminated channel letter sign "CAFÉ" in white LED on dark background, 3D dimensional letters, commercial signage photography, high contrast, clean composition',
    },
    {
      filename: "producto-2.jpg",
      prompt:
        "Vinyl vehicle wrap partial installation on a white van, professional graphic application, colorful company logo design, clean workspace, automotive signage",
    },
    {
      filename: "producto-3.jpg",
      prompt:
        "Roll-up banner stand display with professional corporate design, portable exhibition signage, clean white background with purple accents, marketing material photography",
    },
    {
      filename: "producto-4.jpg",
      prompt:
        "Acrylic signage with standoff mounting on office wall, elegant corporate lobby sign, modern minimalist design, professional interior photography, purple and white branding",
    },
  ],
  galeria: [
    {
      filename: "trabajo-1.jpg",
      prompt:
        "Storefront signage installation, large illuminated fascia sign for retail shop, night photography with purple LED lighting, professional commercial signage",
    },
    {
      filename: "trabajo-2.jpg",
      prompt:
        "Window graphics and decals application on glass storefront, professional vinyl installation, colorful promotional graphics, urban retail environment",
    },
    {
      filename: "trabajo-3.jpg",
      prompt:
        "Wayfinding directional signage system in modern office building, wall-mounted acrylic signs with arrows, professional interior wayfinding, clean minimalist design",
    },
    {
      filename: "trabajo-4.jpg",
      prompt:
        "LED lightbox sign for restaurant, illuminated menu board, modern food service signage, warm lighting, commercial interior photography",
    },
    {
      filename: "trabajo-5.jpg",
      prompt:
        "Fleet vehicle graphics on delivery trucks, professional vehicle wrap design, corporate branding on multiple vehicles, outdoor parking lot setting",
    },
    {
      filename: "trabajo-6.jpg",
      prompt:
        "Exhibition booth signage and display graphics, trade show booth with branded backdrop, professional event signage, modern exhibition design",
    },
    {
      filename: "trabajo-7.jpg",
      prompt:
        "Safety and regulatory signage installation in industrial facility, mandatory safety signs on walls, professional compliance signage, warehouse environment",
    },
    {
      filename: "trabajo-8.jpg",
      prompt:
        "Dimensional lettering on building facade, corporate headquarters exterior signage, large 3D letters mounted on modern architecture, professional architectural photography",
    },
    {
      filename: "trabajo-9.jpg",
      prompt:
        "Menu board and price list signage for cafe, chalkboard style menu with colorful lettering, rustic coffee shop interior, professional food service signage",
    },
    {
      filename: "trabajo-10.jpg",
      prompt:
        'Real estate signage "For Sale" professional yard sign, residential property signage, clean modern design with purple accents, suburban setting',
    },
  ],
  blog: [
    {
      filename: "blog-1.jpg",
      prompt:
        "Signage designer working on computer, creating vector graphics for signs, professional design studio, dual monitor setup with design software, creative workspace",
    },
    {
      filename: "blog-2.jpg",
      prompt:
        "Colorful vinyl rolls and cutting materials on shelves, signage supply materials, professional print shop inventory, organized storage, purple and white materials",
    },
    {
      filename: "blog-3.jpg",
      prompt:
        "Sign installation process, technician mounting LED sign on wall, professional installation tools, work in progress, safety equipment, commercial installation",
    },
  ],
  categorias: [
    {
      filename: "cat-neon.jpg",
      prompt:
        'Modern neon LED sign "OPEN" in pink and purple colors, glowing letters on dark background, trendy signage, commercial business sign, professional photography',
    },
    {
      filename: "cat-letras-3d.jpg",
      prompt:
        '3D dimensional letters spelling "OFFICE" mounted on wall, elegant corporate signage, white PVC letters with shadow effect, professional interior design',
    },
    {
      filename: "cat-vinilos.jpg",
      prompt:
        "Colorful vinyl stickers and decals on glass window, decorative vinyl graphics, retail storefront window graphics, purple and orange designs, professional application",
    },
    {
      filename: "cat-senaletica.jpg",
      prompt:
        "Modern office wayfinding directional signs, wall-mounted acrylic signage with arrows, minimalist design, corporate interior navigation system, clean professional look",
    },
  ],
};

// Función para generar una imagen con Gemini
async function generateImageWithGemini(prompt, apiKey, attempt = 1) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a high-quality image: ${prompt}. Professional commercial photography style, high resolution, suitable for website use.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["Text", "Image"],
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Buscar la imagen en la respuesta
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data; // Base64
        }
      }
    }

    throw new Error("No image data in response");
  } catch (error) {
    if (attempt < API_KEYS.length) {
      console.log(`    ⚠️ Error con API key ${attempt}, probando siguiente...`);
      return generateImageWithGemini(prompt, API_KEYS[attempt], attempt + 1);
    }
    throw error;
  }
}

// Función principal
async function generateAllImages() {
  console.log(`🎨 Generando imágenes con Gemini ${MODEL}...\n`);

  let totalImages = 0;
  let successCount = 0;
  let failCount = 0;

  // Contar total
  for (const category in imagePrompts) {
    totalImages += imagePrompts[category].length;
  }

  console.log(`Total de imágenes a generar: ${totalImages}\n`);

  // Procesar cada categoría
  for (const [category, images] of Object.entries(imagePrompts)) {
    console.log(`\n📁 Categoría: ${category.toUpperCase()}`);
    console.log("=".repeat(50));

    for (const imageData of images) {
      const outputPath = path.join(OUTPUT_DIR, imageData.filename);

      // Verificar si ya existe
      if (fs.existsSync(outputPath)) {
        console.log(`  ✅ ${imageData.filename} (ya existe)`);
        successCount++;
        continue;
      }

      try {
        console.log(`  ⏳ Generando: ${imageData.filename}...`);

        const base64Image = await generateImageWithGemini(
          imageData.prompt,
          API_KEYS[0],
        );

        // Guardar imagen
        fs.writeFileSync(outputPath, Buffer.from(base64Image, "base64"));
        console.log(`  ✅ ${imageData.filename} (generado)`);
        successCount++;

        // Esperar 2 segundos entre peticiones para no saturar
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `  ❌ ${imageData.filename} ERROR:`,
          error.message.substring(0, 100),
        );
        failCount++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN:");
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Fallidas: ${failCount}`);
  console.log(`   📍 Ubicación: ${OUTPUT_DIR}`);
  console.log(`   🤖 Modelo: ${MODEL}`);
  console.log("\n🎉 ¡Proceso completado!");

  if (failCount > 0) {
    console.log(
      "\n💡 Tip: Si algunas imágenes fallaron, puedes volver a ejecutar el script.",
    );
    console.log("   Las imágenes existentes se omitirán automáticamente.");
  }
}

// Ejecutar
generateAllImages().catch(console.error);
