import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
  CheckCircle,
  Truck,
  Shield,
} from "lucide-react";
import "../styles/rotularte.css";
import "../styles/homepage.css";

// Datos mock basados en la estructura PHP
const BANNER_SLIDES = [
  {
    id: 1,
    src: "/images/rotulos/banner-1.jpg",
    alt: "Rótulos profesionales iluminados - Letras corpóreas LED",
  },
  {
    id: 2,
    src: "/images/rotulos/banner-2.jpg",
    alt: "Taller de rótulos - Máquina de corte de vinilo",
  },
  {
    id: 3,
    src: "/images/rotulos/banner-3.jpg",
    alt: "Impresión digital de gran formato - Banners publicitarios",
  },
];

const PRODUCTOS_STRIP = [
  "Lorem ipsum dolor",
  "Sit amet consectetur",
  "Adipiscing elit",
  "Sed do eiusmod",
  "Tempor incididunt",
  "Ut labore et dolore",
  "Magna aliqua",
  "Ut enim ad minim",
  "Veniam quis nostrud",
  "Exercitation ullamco",
  "Laboris nisi ut aliquip",
];

const OFERTAS_INDEX = [
  {
    id: 1,
    nombre: "lorem-ipsum-1.jpg",
    nombre_familia: "Lorem Ipsum 1",
    slug: "lorem-1",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  {
    id: 2,
    nombre: "lorem-ipsum-2.jpg",
    nombre_familia: "Lorem Ipsum 2",
    slug: "lorem-2",
    descripcion:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    id: 3,
    nombre: "lorem-ipsum-3.jpg",
    nombre_familia: "Lorem Ipsum 3",
    slug: "lorem-3",
    descripcion:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  },
  {
    id: 4,
    nombre: "lorem-ipsum-4.jpg",
    nombre_familia: "Lorem Ipsum 4",
    slug: "lorem-4",
    descripcion:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  },
];

const PRODUCTOS_MAS_VENDIDOS = [
  {
    id: 1,
    nombre: "Lorem Ipsum Dolor",
    imagen: "/images/rotulos/producto-1.jpg",
    familia: "Lorem Category 1",
    slug: "lorem-1",
  },
  {
    id: 2,
    nombre: "Sit Amet Consectetur",
    imagen: "/images/rotulos/producto-2.jpg",
    familia: "Lorem Category 2",
    slug: "lorem-2",
  },
  {
    id: 3,
    nombre: "Adipiscing Elit Sed",
    imagen: "/images/rotulos/producto-3.jpg",
    familia: "Lorem Category 3",
    slug: "lorem-3",
  },
  {
    id: 4,
    nombre: "Do Eiusmod Tempor",
    imagen: "/images/rotulos/producto-4.jpg",
    familia: "Lorem Category 4",
    slug: "lorem-4",
  },
];

const TRABAJOS_GALLERY = [
  {
    id: 1,
    src: "/images/rotulos/trabajo-1.jpg",
    alt: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    src: "/images/rotulos/trabajo-2.jpg",
    alt: "Consectetur adipiscing elit",
  },
  {
    id: 3,
    src: "/images/rotulos/trabajo-3.jpg",
    alt: "Sed do eiusmod tempor",
  },
  {
    id: 4,
    src: "/images/rotulos/trabajo-4.jpg",
    alt: "Incididunt ut labore",
  },
  {
    id: 5,
    src: "/images/rotulos/trabajo-5.jpg",
    alt: "Et dolore magna aliqua",
  },
  {
    id: 6,
    src: "/images/rotulos/trabajo-6.jpg",
    alt: "Ut enim ad minim veniam",
  },
  {
    id: 7,
    src: "/images/rotulos/trabajo-7.jpg",
    alt: "Quis nostrud exercitation",
  },
  {
    id: 8,
    src: "/images/rotulos/trabajo-8.jpg",
    alt: "Ullamco laboris nisi",
  },
  {
    id: 9,
    src: "/images/rotulos/trabajo-9.jpg",
    alt: "Ut aliquip ex ea commodo",
  },
  {
    id: 10,
    src: "/images/rotulos/trabajo-10.jpg",
    alt: "Consequat duis aute",
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    titulo: "Lorem Ipsum Dolor Sit Amet Consectetur",
    extracto:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imagen: "/images/rotulos/blog-1.jpg",
    fecha: "15/01/2024",
    slug: "lorem-ipsum-1",
  },
  {
    id: 2,
    titulo: "Adipiscing Elit Sed Do Eiusmod Tempor",
    extracto:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imagen: "/images/rotulos/blog-2.jpg",
    fecha: "10/01/2024",
    slug: "lorem-ipsum-2",
  },
  {
    id: 3,
    titulo: "Duis Aute Irure Dolor In Reprehenderit",
    extracto:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imagen: "/images/rotulos/blog-3.jpg",
    fecha: "05/01/2024",
    slug: "lorem-ipsum-3",
  },
];

const LINKS_RAPIDOS = [
  { label: "Inicio", url: "/" },
  { label: "Productos", url: "/tienda" },
  { label: "Blog", url: "/blog" },
  { label: "Contacto", url: "/contacto" },
  { label: "FAQs", url: "/faqs" },
];

// Componente Header
const Header = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="rlm-site-header">
        <div className="rlm-header-container">
          {/* Logo */}
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

          {/* Info */}
          <div className="rlm-header-info">
            <span>Lorem ipsum dolor sit amet</span>
            <strong>Consectetur: 123 456 789</strong>
          </div>

          {/* Búsqueda */}
          <form className="rlm-header-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="rlm-search-input"
              placeholder="Lorem ipsum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Iconos */}
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
              onClick={() => navigate("/carrito")}
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

      {/* Línea divisoria animada */}
      <div className="rlm-divider"></div>

      {/* Menú móvil */}
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
          <a
            href="/faqs"
            onClick={(e) => {
              e.preventDefault();
              navigate("/faqs");
              setIsMenuOpen(false);
            }}
          >
            FAQs
          </a>
        </nav>
      )}
    </>
  );
};

// Componente Banner con Slider
const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % BANNER_SLIDES.length);
  const prevSlide = () =>
    goToSlide((currentSlide - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);

  return (
    <section id="home-banner" className="home-banner">
      <div className="banner-slider-container">
        {BANNER_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`banner-slide ${index === currentSlide ? "active" : ""}`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="banner-img"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Controles del slider */}
        <button
          className="banner-nav prev"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="banner-nav next"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicadores */}
        <div className="banner-indicators">
          {BANNER_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Franja de productos deslizante */}
      <div className="banner-products-strip">
        <div className="inner">
          {[...PRODUCTOS_STRIP, ...PRODUCTOS_STRIP].map((producto, index) => (
            <span key={index}>{producto}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Grid de Ofertas/Categorías
const OfertasGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="flat-row row-image-box">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="flat-image-box style-1 data-effect clearfix">
              {OFERTAS_INDEX.map((oferta) => (
                <div
                  key={oferta.id}
                  className="oferta-item"
                >
                  <div className="item data-effect-item offers-inner-box">
                    <div className="inner offers-inner">
                      <div className="thumb">
                        <div className="img-sub-banner">
                          <div className="inner2">
                            <div className="thumb2">
                              <a
                                href={`/tienda`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/tienda`);
                                }}
                              >
                                <img
                                  src={`/images/rotulos/producto-${oferta.id}.jpg`}
                                  alt={oferta.nombre_familia}
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
                            href={`/tienda`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/tienda`);
                            }}
                            className="themesflat-button"
                          >
                            {oferta.nombre_familia}
                          </a>
                        </div>
                        <a
                          href={`/tienda`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/tienda`);
                          }}
                        >
                          <div className="overlay-effect bg-color-2"></div>
                        </a>
                      </div>
                      {oferta.descripcion && (
                        <div className="home-offer-desc">
                          {oferta.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="btn-familia-responsive">
                    <a
                      href={`/tienda`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/tienda`);
                      }}
                      className="themesflat-button"
                    >
                      {oferta.nombre_familia}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Productos Más Vendidos
const ProductosDestacados = () => {
  const navigate = useNavigate();

  return (
    <section className="flat-row row-product-new style1">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="title-section">
              <h2 className="title">Lorem Ipsum Products</h2>
            </div>
            <div className="divider h23"></div>
            <div className="product-content product-fourcolumn clearfix">
              <ul className="product style2 clearfix">
                {PRODUCTOS_MAS_VENDIDOS.map((producto) => (
                  <li key={producto.id} className="product-item">
                    <a
                      href={`/tienda`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/tienda`);
                      }}
                    >
                      <div className="product-thumb clearfix">
                        <div className="inner">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="img-centered-of"
                            width="300"
                            height="225"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </a>
                    <div className="product-info clearfix">
                      <span className="product-title">{producto.nombre}</span>
                      <div className="price">
                        <ins></ins>
                      </div>
                    </div>
                    <div className="add-to-cart text-center">
                      <a
                        href={`/tienda`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/tienda`);
                        }}
                      >
                        Lorem Ipsum
                      </a>
                    </div>
                    <a
                      href={`/tienda`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/tienda`);
                      }}
                      className="like"
                    >
                      <span className="cd-familia-like">
                        {producto.familia}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Banner CTA
const BannerCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="flat-row row-animation-box bg-section row-1">
      <div className="overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="flat-animation-block">
              <div className="title-section width-before-17 bg-before-white margin-bottom-14 text-center">
                <h1 className="title font-size-40 line-height-76 white">
                  Lorem Ipsum Dolor
                </h1>
                <div className="elm-btn mt-3">
                  <a
                    href="/tienda"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/tienda");
                    }}
                    className="btn btn-primary"
                  >
                    Lorem Ipsum Sit Amet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Opiniones
const Opiniones = () => {
  return (
    <section id="opiniones" className="flat-row my-5">
      <div className="container-fluid container-width-94">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="text-center mb-4">Lorem Ipsum Dolor Sit Amet</h2>
            <div className="opiniones-grid">
              <div className="opinion-card">
                <div className="opinion-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>
                <p className="opinion-text">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua."
                </p>
                <div className="opinion-author">- Lorem I.</div>
              </div>
              <div className="opinion-card">
                <div className="opinion-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>
                <p className="opinion-text">
                  "Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat."
                </p>
                <div className="opinion-author">- Dolor S.</div>
              </div>
              <div className="opinion-card">
                <div className="opinion-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>
                <p className="opinion-text">
                  "Duis aute irure dolor in reprehenderit in voluptate velit
                  esse cillum dolore eu fugiat nulla pariatur."
                </p>
                <div className="opinion-author">- Amet C.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Galería de Trabajos
const TrabajosGallery = () => {
  return (
    <section className="flat-row row-instagram">
      <div className="container-fluid container-width-94">
        <div className="title-section">
          <h2 className="title blog-title">Lorem Ipsum Gallery</h2>
        </div>
        <div className="divider h23"></div>
        <div className="instagram-wrap style-1 col5 g10 data-effect">
          {TRABAJOS_GALLERY.map((trabajo) => (
            <div key={trabajo.id} className="instagram_badge_image m-b-sm">
              <div className="thumb data-effect-item">
                <div className="inner">
                  <div className="trabajos-ratio">
                    <div className="inner2">
                      <img
                        src={trabajo.src}
                        alt={trabajo.alt}
                        className="img-centered-of"
                        width="400"
                        height="300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Sección Autoridad
const AuthoritySection = () => {
  return (
    <section className="authority-banner">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-7 order-2 order-lg-1">
            <h2 className="title blog-title text-accent mb-3">
              Lorem Ipsum: Dolor Sit Amet Consectetur Adipiscing Elit Sed Do
              Eiusmod Tempor Incididunt
            </h2>
            <p>
              Lorem ipsum dolor sit amet,{" "}
              <strong>consectetur adipiscing</strong> elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris{" "}
              <em>
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore
              </em>
              .
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Sed ut perspiciatis{" "}
              <strong>
                unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium
              </strong>
              .
            </p>

            <div className="authority-scroll-container">
              <ul className="authority-list-horizontal">
                <li>
                  <a href="/tienda">LOREM IPSUM</a>
                </li>
                <li>
                  <a href="/tienda">DOLOR SIT</a>
                </li>
                <li>
                  <a href="/tienda">AMET CONSECTETUR</a>
                </li>
                <li>
                  <a href="/tienda">ADIPISCING ELIT</a>
                </li>
                <li>
                  <a href="/tienda">SED DO EIUSMOD</a>
                </li>
                <li>
                  <a href="/tienda">TEMPOR INCIDIDUNT</a>
                </li>
              </ul>
              <p className="authority-extra">
                UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO
                LABORIS NIUT ALIQUIP EX EA COMMODO CONSEQUAT
                <a href="/tienda">AQUÍ</a>
              </p>
            </div>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>
          </div>

          <div className="col-lg-5 order-1 order-lg-2 mb-4 mb-lg-0">
            <video
              className="img-fluid rounded shadow-sm"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
              />
              <img
                src="https://images.unsplash.com/photo-1563089145-599997674d42?w=640&q=80"
                alt="Lorem Ipsum – Dolor Sit Amet"
                className="img-fluid rounded shadow-sm"
                width="640"
                height="360"
              />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Blog
const BlogSection = () => {
  const navigate = useNavigate();

  return (
    <section className="container my-5" id="blog-home-section">
      <h2
        className="text-center mb-4"
        style={{ fontSize: "clamp(1.6rem,5.5vw,2.4rem)", fontWeight: 400 }}
      >
        Lorem Ipsum Blog Posts
      </h2>

      <div className="row">
        {BLOG_POSTS.map((post) => (
          <div key={post.id} className="col-md-4 mb-4">
            <article className="blog-card h-100">
              {post.imagen && (
                <div className="blog-card-img-wrapper">
                  <a
                    href={`/blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${post.slug}`);
                    }}
                  >
                    <img
                      className="blog-card-img"
                      src={post.imagen}
                      alt={post.titulo}
                      width="400"
                      height="250"
                      loading="lazy"
                    />
                    <div className="blog-card-overlay"></div>
                  </a>
                </div>
              )}

              <div className="blog-card-body">
                <p className="blog-card-date">
                  <Clock size={14} style={{ marginRight: "6px" }} />
                  {post.fecha}
                </p>
                <h3 className="blog-card-title">
                  <a
                    href={`/blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${post.slug}`);
                    }}
                  >
                    {post.titulo}
                  </a>
                </h3>
                <p className="blog-card-excerpt">{post.extracto}</p>
              </div>

              <div className="blog-card-footer">
                <a
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/blog/${post.slug}`);
                  }}
                  className="blog-card-cta"
                >
                  <span>Lorem Ipsum</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <a
          className="blog-view-all-btn"
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            navigate("/blog");
          }}
        >
          Lorem Ipsum All
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

// Componente Newsletter
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h3 className="newsletter-title">Lorem Ipsum Newsletter</h3>
            <p className="newsletter-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>

            {subscribed ? (
              <div className="newsletter-success">
                <CheckCircle size={24} />
                <span>Lorem ipsum dolor sit amet!</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Lorem@ipsum.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary">
                      Lorem Ipsum
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          {/* Logo + Descripción */}
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

          {/* Links Rápidos */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title">Lorem Links</h4>
              <ul className="footer-links">
                {LINKS_RAPIDOS.map((link, index) => (
                  <li key={index}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title"> Lorem Contact</h4>
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

          {/* Redes Sociales */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="footer-section">
              <h4 className="footer-title"> Lorem Social</h4>
              <div className="social-links">
                <a
                  href="https://facebook.com/loremipsum"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com/loremipsum"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://twitter.com/loremipsum"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://linkedin.com/company/loremipsum"
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

        {/* Barra inferior */}
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} LoremIpsum.com. Lorem ipsum dolor sit amet.
          </p>
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

// Componente Principal
const HomePage = () => {
  const [cartCount] = useState(0);
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

    // Forzar todos los colores según el tema seleccionado
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

    // Aplicar todas las variables de color
    document.documentElement.style.setProperty("--color-bg", config.bg);
    document.documentElement.style.setProperty("--color-bg-alt", config.bgAlt);
    document.documentElement.style.setProperty("--color-accent", config.accent);
    document.documentElement.style.setProperty("--color-text", config.text);
    document.documentElement.style.setProperty(
      "--color-text-muted",
      config.textMuted,
    );
    document.documentElement.style.setProperty("--color-metal", config.metal);

    // Guardar preferencias
    localStorage.setItem("rotularte-theme", theme);
    localStorage.setItem("rotularte-color", neonColor);
  }, [theme, neonColor]);

  return (
    <div className="homepage-rotulemos">
      {/* Header */}
      <Header cartCount={cartCount} />

      {/* Banner Slider */}
      <BannerSlider />

      {/* Grid de Ofertas/Categorías */}
      <OfertasGrid />

      {/* Productos Más Vendidos */}
      <ProductosDestacados />

      {/* Banner CTA */}
      <BannerCTA />

      {/* Opiniones */}
      <Opiniones />

      {/* Galería de Trabajos */}
      <TrabajosGallery />

      {/* Sección Autoridad */}
      <AuthoritySection />

      {/* Blog */}
      <BlogSection />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Color Picker */}
      <ColorPicker
        currentTheme={theme}
        setTheme={setTheme}
        currentColor={neonColor}
        setColor={setNeonColor}
      />
    </div>
  );
};

export default HomePage;
