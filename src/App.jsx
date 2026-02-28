import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Palette,
  TrendingUp,
  Users,
  Bell,
  Search,
  User,
  Plus,
  ChevronRight,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import EditorUsage from "./components/EditorUsage";
import RecentOrders from "./components/RecentOrders";
import SalesChart from "./components/SalesChart";
import ActivityFeed from "./components/ActivityFeed";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import EditorPage from "./pages/EditorPage";
import StatsPage from "./pages/StatsPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import "./styles/sidebar.css";
import "./styles/header.css";
import "./components/Dashboard.css";
import { useBrandConfig } from "./hooks/useBrandConfig";

const stats = [
  {
    title: "Pedidos Totales",
    value: "156",
    change: "+12%",
    changeType: "up",
    icon: ShoppingBag,
    color: "purple",
    id: "orders",
  },
  {
    title: "Usos del Editor",
    value: "1,284",
    change: "+28%",
    changeType: "up",
    icon: Palette,
    color: "amber",
    id: "editor",
  },
  {
    title: "Clientes Activos",
    value: "89",
    change: "+5%",
    changeType: "up",
    icon: Users,
    color: "green",
    id: "clients",
  },
  {
    title: "Ingresos (Mes)",
    value: "€8,420",
    change: "+18%",
    changeType: "up",
    icon: TrendingUp,
    color: "blue",
    id: "revenue",
  },
];

// Dashboard Component
function Dashboard({ mounted }) {
  const { config: brandConfig } = useBrandConfig();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div
        className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-base text-gray-500 mb-2">Bienvenido de vuelta</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard
              <span
                style={{
                  color: brandConfig.useCustomColor
                    ? brandConfig.customPrimaryColor
                    : "var(--color-primary)",
                }}
              >
                .
              </span>
            </h2>
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: brandConfig.useCustomColor
                ? brandConfig.customPrimaryColor
                : "var(--color-primary)",
              boxShadow: `0 10px 15px -3px ${brandConfig.useCustomColor ? brandConfig.customPrimaryColor : "var(--color-primary)"}33`,
            }}
          >
            <Plus size={20} />
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {stats.map((stat, index) => (
          <StatsCard key={stat.id} {...stat} delay={index * 100} />
        ))}
      </div>

      {/* Charts Row */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-500 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <SalesChart />
        <EditorUsage />
      </div>

      {/* Bottom Row */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 pt-8 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-500">
            © 2026 {brandConfig.companyName}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Soporte
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Documentación
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Detectar si estamos en modo standalone (editor en nueva pestaña)
  const isStandalone =
    window.location.search.includes("standalone=true") ||
    window.location.pathname === "/editor";

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentPage("order-detail");
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setCurrentPage("orders");
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: {
        title: "Dashboard",
        subtitle: "Vista general de tu negocio",
      },
      orders: { title: "Pedidos", subtitle: "Gestiona tus pedidos" },
      "order-detail": {
        title: "Detalle del Pedido",
        subtitle: "Información completa",
      },
      editor: { title: "Editor", subtitle: "Crea y personaliza rótulos" },
      products: { title: "Productos", subtitle: "Catálogo de productos" },
      stats: { title: "Estadísticas", subtitle: "Análisis de rendimiento" },
      settings: {
        title: "Configuración",
        subtitle: "Personaliza tu plataforma",
      },
    };
    return titles[currentPage] || { title: "Dashboard", subtitle: "" };
  };

  const pageInfo = getPageTitle();

  // Si estamos en modo standalone, mostrar solo el editor
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gray-100">
        <EditorPage standalone={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Mejorado */}
        <header className="app-header">
          {/* Barra superior */}
          <div className="header-top">
            <div className="header-container">
              {/* Left: Breadcrumb y Título */}
              <div className="header-left">
                <nav className="breadcrumb">
                  <span className="breadcrumb-link">Inicio</span>
                  <ChevronRight size={14} className="breadcrumb-separator" />
                  <span className="breadcrumb-current">{pageInfo.title}</span>
                </nav>
                <h1 className="header-title">{pageInfo.title}</h1>
                <p className="header-subtitle">{pageInfo.subtitle}</p>
              </div>

              {/* Center: Buscador */}
              <div className="header-search-wrapper">
                <div className="search-container">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar pedidos, productos, clientes..."
                    className="search-input"
                  />
                  <kbd className="search-shortcut">⌘K</kbd>
                </div>
              </div>

              {/* Right: Acciones */}
              <div className="header-actions">
                {/* Botón Nuevo */}
                <button
                  onClick={() => setCurrentPage("orders")}
                  className="btn-new-order"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Nuevo Pedido</span>
                </button>

                {/* Notificaciones */}
                <div className="notification-wrapper">
                  <button className="btn-notification">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                  </button>
                </div>

                {/* Usuario */}
                <div className="user-section">
                  <div className="user-info">
                    <p className="user-name">Admin</p>
                    <p className="user-role">Gerente</p>
                  </div>
                  <button className="user-button">
                    <div className="user-avatar">
                      <User size={18} strokeWidth={2} />
                    </div>
                    <ChevronRight size={16} className="user-dropdown-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de información rápida */}
          <div className="header-info-bar">
            <div className="info-bar-content">
              <div className="info-bar-left">
                <div className="system-status">
                  <span className="status-indicator"></span>
                  <span className="status-text">Sistema operativo</span>
                </div>
                <span className="info-divider">|</span>
                <span className="info-time">{formatTime(currentTime)}</span>
              </div>
              <button className="btn-help">
                <HelpCircle size={16} />
                <span>Ayuda</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 min-h-full">
            <div className="p-6 lg:p-8">
              {currentPage === "dashboard" && <Dashboard mounted={mounted} />}
              {currentPage === "orders" && (
                <OrdersPage onViewOrder={handleViewOrder} />
              )}
              {currentPage === "order-detail" && (
                <OrderDetailPage
                  orderId={selectedOrderId}
                  onBack={handleBackToOrders}
                />
              )}
              {currentPage === "editor" && <EditorPage />}
              {currentPage === "clients" && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Clientes
                    </h2>
                    <p className="text-gray-500">
                      Gestión de clientes en desarrollo.
                    </p>
                  </div>
                </div>
              )}
              {currentPage === "products" && <ProductsPage />}
              {currentPage === "stats" && <StatsPage />}
              {currentPage === "settings" && <SettingsPage />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
