import React, { useState } from "react";
import {
  Palette,
  Zap,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Sparkles,
  Ruler,
  Clock,
  Award,
} from "lucide-react";
import "../styles/landing.css";

const features = [
  {
    icon: Palette,
    title: "Editor Visual Intuitivo",
    description:
      "Diseña tus rótulos con nuestro editor drag-and-drop. Previsualiza en tiempo real cómo quedará tu producto final.",
  },
  {
    icon: Ruler,
    title: "Personalización Total",
    description:
      "Elige entre cientos de fuentes, colores, materiales y acabados. Cada detalle está bajo tu control.",
  },
  {
    icon: Zap,
    title: "Cotización Instantánea",
    description:
      "Obtén precios en tiempo real según tus especificaciones. Sin sorpresas ni costes ocultos.",
  },
  {
    icon: Truck,
    title: "Envío Express",
    description:
      "Recibe tus pedidos en 24-48 horas. Envíos gratuitos en pedidos superiores a €100.",
  },
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description:
      "Materiales premium y acabados profesionales. Garantía de satisfacción o te devolvemos el dinero.",
  },
  {
    icon: Award,
    title: "Soporte Experto",
    description:
      "Nuestro equipo de diseñadores está disponible para ayudarte a crear el rótulo perfecto.",
  },
];

const steps = [
  {
    number: "1",
    title: "Diseña",
    description: "Usa nuestro editor online para crear tu rótulo perfecto con todas las opciones disponibles.",
  },
  {
    number: "2",
    title: "Personaliza",
    description: "Elige materiales, tamaños, colores y acabados. Cotiza al instante sin compromiso.",
  },
  {
    number: "3",
    title: "Recibe",
    description: "Realiza tu pedido y recíbelo en casa en 24-48h con envío express disponible.",
  },
];

const testimonials = [
  {
    name: "María García",
    role: "Dueña de Tienda",
    content: "El mejor servicio de rótulos que he encontrado. La calidad es increíble y el editor es súper fácil de usar.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "Restaurante La Plaza",
    content: "Hemos pedido varias veces y siempre perfecto. La atención al cliente es excepcional.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Agencia de Eventos",
    content: "Rápidos, profesionales y con precios muy competitivos. Totalmente recomendados.",
    rating: 5,
  },
];

function LandingPage({ onEnterApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-container">
          <a href="#" className="landing-logo">
            <div className="landing-logo-icon">
              <Sparkles size={22} />
            </div>
            Rótulos Pro
          </a>

          <div className="landing-nav-links">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>
              Características
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection("how-it-works"); }}>
              Cómo funciona
            </a>
            <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}>
              Opiniones
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>
              Contacto
            </a>
          </div>

          <div className="landing-nav-buttons">
            <button className="landing-btn landing-btn-secondary" onClick={onEnterApp}>
              Acceder
            </button>
            <button className="landing-btn landing-btn-primary" onClick={onEnterApp}>
              Crear Rótulo
            </button>
            <button
              className="landing-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: "20px",
            background: "white",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
                style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>
                Características
              </a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection("how-it-works"); }}
                style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>
                Cómo funciona
              </a>
              <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}
                style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>
                Opiniones
              </a>
              <button className="landing-btn landing-btn-primary" onClick={onEnterApp} style={{ width: "100%", justifyContent: "center" }}>
                Crear Rótulo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div>
            <div className="landing-hero-badge">
              <Sparkles size={16} />
              Nuevo: Edición colaborativa
            </div>
            <h1>
              Crea rótulos <span>profesionales</span> en minutos
            </h1>
            <p>
              Diseña rótulos personalizados con nuestro editor online. Calidad profesional, 
              precios transparentes y envío rápido a toda España.
            </p>
            <div className="landing-hero-buttons">
              <button className="landing-btn landing-btn-primary landing-btn-large" onClick={onEnterApp}>
                Empezar a diseñar
                <ArrowRight size={20} />
              </button>
              <button className="landing-btn landing-btn-secondary landing-btn-large" onClick={() => scrollToSection("how-it-works")}>
                Ver cómo funciona
              </button>
            </div>
            <div className="landing-hero-stats">
              <div className="landing-stat">
                <div className="landing-stat-value">10K+</div>
                <div className="landing-stat-label">Rótulos creados</div>
              </div>
              <div className="landing-stat">
                <div className="landing-stat-value">4.9</div>
                <div className="landing-stat-label">Valoración media</div>
              </div>
              <div className="landing-stat">
                <div className="landing-stat-value">24h</div>
                <div className="landing-stat-label">Envío express</div>
              </div>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-editor-preview">
              <div className="landing-editor-header">
                <div className="landing-editor-dots">
                  <div className="landing-editor-dot landing-editor-dot-red"></div>
                  <div className="landing-editor-dot landing-editor-dot-yellow"></div>
                  <div className="landing-editor-dot landing-editor-dot-green"></div>
                </div>
                <span className="landing-editor-title">Editor de Rótulos</span>
              </div>
              <div className="landing-editor-body">
                <div className="landing-sign-preview">
                  <div className="landing-sign-text">MI NEGOCIO</div>
                  <div className="landing-sign-subtext">Vista previa de tu diseño</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Todo lo que necesitas para crear rótulos perfectos</h2>
            <p>
              Nuestra plataforma combina tecnología de vanguardia con materiales de 
              primera calidad para ofrecerte el mejor servicio.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="landing-feature-card">
                <div className="landing-feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-how-it-works">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>¿Cómo funciona?</h2>
            <p>Crea tu rótulo profesional en tres simples pasos</p>
          </div>

          <div className="landing-steps">
            {steps.map((step, index) => (
              <div key={index} className="landing-step">
                <div className="landing-step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: "100px 24px", background: "white" }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Lo que dicen nuestros clientes</h2>
            <p>Miles de empresas confían en nosotros para sus rótulos</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  padding: "32px",
                  background: "#f9fafb",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: "16px", color: "#374151", marginBottom: "20px", lineHeight: 1.6 }}>
                  "{testimonial.content}"
                </p>
                <div>
                  <p style={{ fontWeight: 700, color: "#111827" }}>{testimonial.name}</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-container">
          <h2>¿Listo para crear tu rótulo?</h2>
          <p>Únete a miles de empresas que ya confían en nosotros. Empieza a diseñar gratis.</p>
          <button className="landing-btn landing-btn-white landing-btn-large" onClick={onEnterApp}>
            Crear mi rótulo ahora
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-grid">
            <div className="landing-footer-brand">
              <div className="landing-footer-logo">
                <div className="landing-footer-logo-icon">
                  <Sparkles size={22} color="white" />
                </div>
                Rótulos Pro
              </div>
              <p>
                La plataforma líder en diseño y fabricación de rótulos personalizados. 
                Calidad profesional al mejor precio.
              </p>
            </div>

            <div className="landing-footer-column">
              <h4>Productos</h4>
              <ul>
                <li><a href="#">Rótulos luminosos</a></li>
                <li><a href="#">Letras corpóreas</a></li>
                <li><a href="#">Vinilos</a></li>
                <li><a href="#">Lonas</a></li>
              </ul>
            </div>

            <div className="landing-footer-column">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Trabaja con nosotros</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>

            <div className="landing-footer-column">
              <h4>Soporte</h4>
              <ul>
                <li><a href="#">Centro de ayuda</a></li>
                <li><a href="#">Preguntas frecuentes</a></li>
                <li><a href="#">Envíos y devoluciones</a></li>
                <li><a href="#">Términos y condiciones</a></li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <p>© 2026 Rótulos Pro. Todos los derechos reservados.</p>
            <div className="landing-social-links">
              <a href="#"><Instagram size={18} /></a>
              <a href="#"><Twitter size={18} /></a>
              <a href="#"><Facebook size={18} /></a>
              <a href="#"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
