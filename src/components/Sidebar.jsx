import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Palette,
  Package,
  TrendingUp,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import "../styles/sidebar.css";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ShoppingCart, label: "Pedidos", badge: "12", id: "orders" },
  { icon: Palette, label: "Editor", badge: "3", id: "editor" },
  { icon: Package, label: "Productos", id: "products" },
  { icon: TrendingUp, label: "Estadísticas", id: "stats" },
  { icon: Settings, label: "Configuración", id: "settings" },
];

export default function Sidebar({ onNavigate, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (id) => {
    onNavigate(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-mobile-button"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${
          isOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"
        }`}
      >
        <div className="sidebar-inner">
          {/* Logo Section */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-content">
              <div className="sidebar-logo-icon">
                <Palette className="text-white" size={26} strokeWidth={2} />
              </div>
              <div className="sidebar-logo-text">
                <h1>RótulosPro</h1>
                <p>Panel de Control</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="sidebar-nav-title">Menú Principal</div>

            <ul className="sidebar-menu">
              {menuItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id} className="sidebar-menu-item">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`sidebar-menu-button ${
                        isActive ? "active" : ""
                      }`}
                    >
                      <item.icon
                        size={22}
                        strokeWidth={isActive ? 2 : 1.5}
                        className="sidebar-menu-icon"
                      />
                      <span className="sidebar-menu-label">{item.label}</span>

                      {item.badge && (
                        <span
                          className={`sidebar-badge ${
                            isActive ? "" : "sidebar-badge-default"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight size={18} className="sidebar-arrow" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="sidebar-footer">
            <button className="sidebar-logout-button">
              <LogOut size={22} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
