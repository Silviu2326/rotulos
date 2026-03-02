import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Heart,
  Eye,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ChevronRight,
  User,
  Menu,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ChevronDown,
  Wand2,
} from "lucide-react";
import "../styles/rotularte.css";
import "../styles/store-rotulemos.css";

// Componente ColorPicker
const ColorPicker = ({ currentTheme, setTheme, currentColor, setColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { color: "#ff6b00", name: "Naranja Neón" },
    { color: "#00ff88", name: "Verde Neón" },
    { color: "#00d4ff", name: "Cian Neón" },
    { color: "#ff006e", name: "Rosa Neón" },
    { color: "#fb5607", name: "Coral" },
    { color: "#8338ec", name: "Púrpura" },
    { color: "#ffbe0b", name: "Amarillo" },
    { color: "#3a86ff", name: "Azul" },
  ];

  const themes = [
    {
      id: "industrial",
      name: "Industrial",
      desc: "⚡ Grid técnico visible / Monospace / Workshop oscuro",
      bg: "#0a0a0a",
      accent: "#ff6b00",
    },
    {
      id: "minimal",
      name: "Minimal",
      desc: "✨ Ultra aireado / Playfair Display / Sombras etéreas",
      bg: "#fafafa",
      accent: "#2d2d2d",
    },
    {
      id: "brutalist",
      name: "Brutalista",
      desc: "⚫ Negro absoluto / Bordes 3px / Sin redondeos",
      bg: "#000000",
      accent: "#ffffff",
    },
    {
      id: "vaporwave",
      name: "Vaporwave",
      desc: "🌆 Chrome & Gradientes / 3D Perspective / Glassmorphism",
      bg: "#0c0518",
      accent: "#ff71ce",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      desc: "⚡ Futurista / Glitch effects / Neon glow",
      bg: "#050810",
      accent: "#00ff9f",
    },
  ];

  return (
    <>
      <button
        className="color-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar colores"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      </button>

      <div className={`color-picker-panel ${isOpen ? "active" : ""}`}>
        <div className="color-picker-header">
          <span>Personalizar</span>
          <button
            className="color-picker-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="color-presets">
          {colors.map((c) => (
            <button
              key={c.color}
              className={`color-preset ${currentColor === c.color ? "active" : ""}`}
              style={{ background: c.color }}
              onClick={() => setColor(c.color)}
              title={c.name}
            />
          ))}
        </div>

        <div className="custom-color-section">
          <label className="custom-color-label">Color Personalizado</label>
          <div className="color-input-wrapper">
            <input
              type="color"
              className="color-input"
              value={currentColor}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="text"
              className="color-hex-input"
              value={currentColor.toUpperCase()}
              onChange={(e) => setColor(e.target.value)}
              maxLength={7}
            />
          </div>
        </div>

        <div className="theme-section">
          <label className="theme-label">Estilo Visual</label>
          <div className="theme-options">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-btn ${currentTheme === t.id ? "active" : ""}`}
                onClick={() => setTheme(t.id)}
              >
                <div
                  className="theme-preview"
                  style={{
                    background: t.bg,
                    border: `2px solid ${t.id === "minimal" ? "#e5e5e5" : "#333"}`,
                    borderRadius:
                      t.id === "vaporwave" || t.id === "minimal" ? "8px" : "0",
                  }}
                >
                  <span
                    className="t-bg"
                    style={{
                      color: t.id === "minimal" ? "#999" : "#666",
                      fontSize: "0.5rem",
                    }}
                  >
                    BG
                  </span>
                  <span
                    className="t-accent"
                    style={{
                      color: t.accent,
                      fontSize: "0.6rem",
                      textShadow:
                        t.id === "vaporwave" ? "2px 2px #01cdfe" : "none",
                    }}
                  >
                    A
                  </span>
                </div>
                <div className="theme-info">
                  <span className="theme-name">{t.name}</span>
                  <span className="theme-desc">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Categorías con descripciones tipo Lorem
const CATEGORIAS_DATA = [
  {
    id: "lorem-1",
    slug: "lorem-1",
    name: "Lorem Ipsum 1",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    imagen: "/images/rotulos/cat-neon.jpg",
  },
  {
    id: "lorem-2",
    slug: "lorem-2",
    name: "Lorem Ipsum 2",
    descripcion:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    imagen: "/images/rotulos/cat-letras-3d.jpg",
  },
  {
    id: "lorem-3",
    slug: "lorem-3",
    name: "Lorem Ipsum 3",
    descripcion:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    imagen: "/images/rotulos/cat-vinilos.jpg",
  },
  {
    id: "lorem-4",
    slug: "lorem-4",
    name: "Lorem Ipsum 4",
    descripcion:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    imagen: "/images/rotulos/cat-senaletica.jpg",
  },
];

// Productos - con tipo para determinar si va al editor
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Lorem Ipsum Dolor",
    category: "Lorem Ipsum 1",
    slug: "lorem-ipsum-1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    price: 199,
    originalPrice: 249,
    image: "/images/rotulos/producto-1.jpg",
    badge: "Más Vendido",
    tipo: "configurable",
    categoriaEditor: "letras-neon",
  },
  {
    id: 2,
    name: "Sit Amet Consectetur",
    category: "Lorem Ipsum 2",
    slug: "sit-amet-2",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    price: 89,
    image: "/images/rotulos/producto-2.jpg",
    tipo: "configurable",
    categoriaEditor: "vinilos",
  },
  {
    id: 3,
    name: "Adipiscing Elit Sed",
    category: "Lorem Ipsum 3",
    slug: "adipiscing-elit-3",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    price: 45,
    originalPrice: 65,
    image: "/images/rotulos/producto-3.jpg",
    badge: "Oferta",
    tipo: "simple",
  },
  {
    id: 4,
    name: "Do Eiusmod Tempor",
    category: "Lorem Ipsum 4",
    slug: "do-eiusmod-4",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    price: 159,
    image: "/images/rotulos/producto-4.jpg",
    tipo: "configurable",
    categoriaEditor: "letras-corporeas",
  },
  {
    id: 5,
    name: "Incididunt Ut Labore",
    category: "Lorem Ipsum 1",
    slug: "incididunt-ut-5",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    price: 129,
    image: "/images/rotulos/trabajo-4.jpg",
    tipo: "configurable",
    categoriaEditor: "letras-neon",
  },
  {
    id: 6,
    name: "Et Dolore Magna",
    category: "Lorem Ipsum 2",
    slug: "et-dolore-6",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    price: 249,
    image: "/images/rotulos/trabajo-8.jpg",
    badge: "Nuevo",
    tipo: "configurable",
    categoriaEditor: "letras-corporeas",
  },
  {
    id: 7,
    name: "Aliqua Ut Enim",
    category: "Lorem Ipsum 3",
    slug: "aliqua-ut-7",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
    price: 29,
    image: "/images/rotulos/trabajo-2.jpg",
    tipo: "configurable",
    categoriaEditor: "vinilos",
  },
  {
    id: 8,
    name: "Minim Veniam Quis",
    category: "Lorem Ipsum 1",
    slug: "minim-veniam-8",
    description:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.",
    price: 129,
    image: "/images/rotulos/trabajo-1.jpg",
    badge: "Popular",
    tipo: "configurable",
    categoriaEditor: "letras-neon",
  },
];

// FAQs
const FAQS_DATA = [
  {
    pregunta: "Lorem ipsum dolor sit amet?",
    respuesta:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    pregunta: "Consectetur adipiscing elit sed do?",
    respuesta:
      "El plazo estándar es de 5-7 días laborables desde la aprobación del diseño. Disponemos de servicio urgente en 48-72h bajo consulta.",
  },
  {
    pregunta: "Eiusmod tempor incididunt ut labore?",
    respuesta:
      "Sí, utilizamos materiales resistentes a la intemperie con protección UV y acabados impermeables. Garantía de 2 años en exteriores.",
  },
  {
    pregunta: "Et dolore magna aliqua ut enim?",
    respuesta:
      "Sí, ofrecemos servicio de instalación profesional en toda España. También enviamos con kit de montaje para instalación propia.",
  },
];

// Componente Header estilo Rotulemos
const Header = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="rlm-site-header">
        <div className="rlm-header-container">
          <a
            href="/"
            className="rlm-logo-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <span className="rlm-logo-text">
              <span className="purple">Lorem</span>
              <span className="black">Ipsum</span>
            </span>
            <span className="rlm-logo-com">.com</span>
          </a>

          <div className="rlm-header-info">
            <span>Lorem ipsum dolor sit amet</span>
            <strong>Consectetur: 123 456 789</strong>
          </div>

          <form className="rlm-header-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="rlm-search-input"
              placeholder="Lorem ipsum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="rlm-header-icons">
            <button
              className="rlm-icon-btn"
              onClick={() => navigate("/usuario")}
              aria-label="Mi cuenta"
            >
              <User size={20} />
            </button>
            <button
              className="rlm-icon-btn"
              onClick={onCartClick}
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="rlm-cart-badge">{cartCount}</span>
              )}
            </button>
            <button
              className="rlm-icon-btn rlm-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="rlm-divider"></div>

      {isMenuOpen && (
        <nav className="rlm-mobile-menu">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setIsMenuOpen(false);
            }}
          >
            Inicio
          </a>
          <a
            href="/tienda"
            onClick={(e) => {
              e.preventDefault();
              navigate("/tienda");
              setIsMenuOpen(false);
            }}
          >
            Productos
          </a>
          <a
            href="/editor"
            onClick={(e) => {
              e.preventDefault();
              navigate("/editor");
              setIsMenuOpen(false);
            }}
          >
            Editor
          </a>
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              navigate("/blog");
              setIsMenuOpen(false);
            }}
          >
            Blog
          </a>
          <a
            href="/contacto"
            onClick={(e) => {
              e.preventDefault();
              navigate("/contacto");
              setIsMenuOpen(false);
            }}
          >
            Contacto
          </a>
        </nav>
      )}
    </>
  );
};

// Componente Breadcrumb
const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb-cat" aria-label="breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {item.url ? (
              <a
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.url;
                }}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Componente Categorías Grid
const CategoriasGrid = ({ onCategoryClick }) => {
  return (
    <section className="categorias-section">
      <div className="container">
        <div className="flat-image-box style-1 row data-effect clearfix">
          {CATEGORIAS_DATA.map((cat) => (
            <div key={cat.id} className="col-12 col-md-6 col-lg-3 m-b-lg">
              <div className="item data-effect-item offers-inner-box">
                <div className="inner offers-inner">
                  <div className="thumb">
                    <div className="img-sub-banner">
                      <div className="inner2">
                        <div className="thumb2">
                          <a
                            href={`/productos/${cat.slug}/`}
                            onClick={(e) => {
                              e.preventDefault();
                              onCategoryClick(cat.name);
                            }}
                          >
                            <img
                              src={cat.imagen}
                              alt={cat.name}
                              className="img-centered-of"
                              width="400"
                              height="300"
                              loading="lazy"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="elm-btn">
                      <a
                        href={`/productos/${cat.slug}/`}
                        onClick={(e) => {
                          e.preventDefault();
                          onCategoryClick(cat.name);
                        }}
                        className="themesflat-button"
                      >
                        {cat.name}
                      </a>
                    </div>
                    <a
                      href={`/productos/${cat.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onCategoryClick(cat.name);
                      }}
                    >
                      <div className="overlay-effect bg-color-2"></div>
                    </a>
                  </div>
                  <div className="home-offer-desc">{cat.descripcion}</div>
                </div>
              </div>
              <div className="btn-familia-responsive">
                <a
                  href={`/productos/${cat.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryClick(cat.name);
                  }}
                  className="themesflat-button"
                >
                  {cat.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente FAQs
const FAQsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faqs-categoria">
      <div className="container">
        <h2 className="faqs-title">Preguntas frecuentes</h2>
        <div className="faqs-grid">
          {FAQS_DATA.map((faq, index) => (
            <details
              key={index}
              className="faq-item"
              open={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <summary className="faq-question">{faq.pregunta}</summary>
              <div className="faq-answer">{faq.respuesta}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Contenido Editorial
const ContenidoEditorial = () => {
  return (
    <section className="contenido-editorial">
      <div className="container">
        <h2>Lorem Ipsum Dolor Sit Amet</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </div>
    </section>
  );
};

// Componente Footer estilo Rotulemos
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h3 className="footer-logo">
                <span className="purple">Lorem</span>
                <span className="black">Ipsum</span>
                <span className="com">.com</span>
              </h3>
              <p className="footer-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title">Lorem Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="/">Inicio</a>
                </li>
                <li>
                  <a href="/tienda">Productos</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/contacto">Contacto</a>
                </li>
                <li>
                  <a href="/faqs">FAQs</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title">Lorem Contact</h4>
              <ul className="footer-contact">
                <li>
                  <Mail size={16} />
                  <a href="mailto:lorem@ipsum.com">lorem@ipsum.com</a>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+34123456789">123 456 789</a>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Lorem Ipsum Street, 123, 00000 Dolor Sit, Amet</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title">Lorem Social</h4>
              <div className="social-links">
                <a
                  href="https://facebook.com/rotulemos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com/rotulemos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://twitter.com/rotulemos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://linkedin.com/company/rotulemos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} LoremIpsum.com. Lorem ipsum dolor sit amet.</p>
          <div className="footer-bottom-links">
            <a href="/privacidad">Lorem</a>
            <a href="/terminos">Ipsum</a>
            <a href="/cookies">Dolor</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente Carrito Lateral
const CartSidebar = ({
  isOpen,
  onClose,
  cart,
  onRemove,
  onUpdateQuantity,
  total,
  count,
}) => {
  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h2 className="cart-title">Tu Carrito ({count})</h2>
          <button className="cart-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={60} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">€{item.price}</div>
                  <div className="cart-item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">
              Finalizar compra
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Página Principal
const StorePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("rotularte-theme") || "industrial",
  );
  const [neonColor, setNeonColor] = useState(
    () => localStorage.getItem("rotularte-color") || "#ff6b00",
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--color-neon", neonColor);
    document.documentElement.style.setProperty("--color-neon-glow", neonColor);

    const themeConfig = {
      industrial: {
        bg: "#0a0a0a",
        bgAlt: "#111111",
        accent: "#ffffff",
        text: "#e0e0e0",
        textMuted: "#666666",
        metal: "#2a2a2a",
      },
      minimal: {
        bg: "#fafafa",
        bgAlt: "#ffffff",
        accent: "#1a1a1a",
        text: "#333333",
        textMuted: "#888888",
        metal: "#e5e5e5",
      },
      brutalist: {
        bg: "#000000",
        bgAlt: "#000000",
        accent: "#ffffff",
        text: "#ffffff",
        textMuted: "#666666",
        metal: "#ffffff",
      },
      vaporwave: {
        bg: "#0c0518",
        bgAlt: "#120824",
        accent: "#ffffff",
        text: "#e0e0ff",
        textMuted: "#8a7a9e",
        metal: "#1a0f2e",
      },
      cyberpunk: {
        bg: "#050810",
        bgAlt: "#0a1020",
        accent: "#ffffff",
        text: "#a0ffe0",
        textMuted: "#507060",
        metal: "#102030",
      },
    };

    const config = themeConfig[theme] || themeConfig.industrial;
    document.documentElement.style.setProperty("--color-bg", config.bg);
    document.documentElement.style.setProperty("--color-bg-alt", config.bgAlt);
    document.documentElement.style.setProperty("--color-accent", config.accent);
    document.documentElement.style.setProperty("--color-text", config.text);
    document.documentElement.style.setProperty(
      "--color-text-muted",
      config.textMuted,
    );
    document.documentElement.style.setProperty("--color-metal", config.metal);

    localStorage.setItem("rotularte-theme", theme);
    localStorage.setItem("rotularte-color", neonColor);
  }, [theme, neonColor]);

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesCategory =
      activeFilter === "all" || product.category === activeFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleCategoryClick = (categoryName) => {
    setActiveFilter(categoryName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="store-page-rotulemos">
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={cartTotal}
        count={cartCount}
      />

      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      <section className="categoria-page">
        <div className="container">
          <Breadcrumb
            items={[
              { label: "Inicio", url: "/" },
              { label: "Productos", url: "/tienda" },
              { label: activeFilter === "all" ? "Todos" : activeFilter },
            ]}
          />

          <header className="cat-header">
            <h1>
              {activeFilter === "all" ? "Lorem Ipsum Products" : activeFilter}
            </h1>
            <p className="cat-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
          </header>

          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                Todos
              </button>
              {CATEGORIAS_DATA.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeFilter === cat.name ? "active" : ""}`}
                  onClick={() => setActiveFilter(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {activeFilter === "all" && (
            <>
              <h2 className="section-title">Lorem Ipsum Categories</h2>
              <CategoriasGrid onCategoryClick={handleCategoryClick} />
            </>
          )}

          <h2 className="section-title">
            {activeFilter === "all"
              ? "Lorem Ipsum Products"
              : `Lorem in ${activeFilter}`}
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="alert alert-info">
              <p>
                <strong>No hay productos disponibles.</strong>
              </p>
            </div>
          ) : (
            <div className="productos-grid">
              {filteredProducts.map((product) => (
                <article className="prod-card" key={product.id}>
                  <a
                    href={`/producto/${product.slug}/`}
                    className="prod-link"
                    onClick={(e) => {
                      e.preventDefault();
                      // Si es un producto configurable, ir al editor
                      if (
                        product.tipo === "configurable" &&
                        product.categoriaEditor
                      ) {
                        navigate(
                          `/editor?categoria=${product.categoriaEditor}&producto=${product.id}&nombre=${encodeURIComponent(product.name)}`,
                        );
                      } else {
                        // Si es producto simple, ir a página de producto normal
                        navigate(`/producto/${product.id}`);
                      }
                    }}
                  >
                    <figure className="prod-thumb">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/no-image.jpg";
                        }}
                      />
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      {product.tipo === "configurable" && (
                        <span className="product-badge badge-configurable">
                          Personalizar
                        </span>
                      )}
                      <div className="product-actions">
                        <button
                          className="action-btn"
                          title={
                            product.tipo === "configurable"
                              ? "Personalizar"
                              : "Ver detalles"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (
                              product.tipo === "configurable" &&
                              product.categoriaEditor
                            ) {
                              navigate(
                                `/editor?categoria=${product.categoriaEditor}&producto=${product.id}&nombre=${encodeURIComponent(product.name)}`,
                              );
                            } else {
                              navigate(`/producto/${product.id}`);
                            }
                          }}
                        >
                          {product.tipo === "configurable" ? (
                            <Wand2 size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                        <button
                          className="action-btn"
                          title="Añadir a favoritos"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart
                            size={20}
                            fill={
                              favorites.includes(product.id)
                                ? "var(--color-neon)"
                                : "none"
                            }
                            color={
                              favorites.includes(product.id)
                                ? "var(--color-neon)"
                                : "currentColor"
                            }
                          />
                        </button>
                      </div>
                    </figure>
                    <div className="prod-info">
                      <h3>{product.name}</h3>
                      {product.originalPrice && (
                        <span className="prod-original-price">
                          €{product.originalPrice}
                        </span>
                      )}
                      <p className="prod-price">Desde €{product.price}</p>
                      <p className="prod-desc">{product.description}</p>
                      <span className="prod-cta">Ver detalles →</span>
                    </div>
                  </a>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={18} />
                    Añadir
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContenidoEditorial />
      <FAQsSection />
      <Footer />

      <ColorPicker
        currentTheme={theme}
        setTheme={setTheme}
        currentColor={neonColor}
        setColor={setNeonColor}
      />
    </div>
  );
};

export default StorePage;
