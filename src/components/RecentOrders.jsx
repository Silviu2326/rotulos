import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

const orders = [
  {
    id: "#R-4521",
    client: "Restaurante El Sabor",
    type: "Rótulo Luminoso",
    total: "€450.00",
    status: "pendiente",
    date: "Hace 2h",
  },
  {
    id: "#R-4520",
    client: "Tienda Moda Urbana",
    type: "Vinilo Escaparate",
    total: "€120.00",
    status: "en_proceso",
    date: "Hace 5h",
  },
  {
    id: "#R-4519",
    client: "Café Central",
    type: "Letras Corpóreas",
    total: "€890.00",
    status: "completado",
    date: "Ayer",
  },
  {
    id: "#R-4518",
    client: "Gimnasio FitLife",
    type: "Panel Publicitario",
    total: "€320.00",
    status: "completado",
    date: "Ayer",
  },
  {
    id: "#R-4517",
    client: "Panadería San Juan",
    type: "Rótulo Metálico",
    total: "€280.00",
    status: "enviado",
    date: "Hace 2 días",
  },
];

const statusConfig = {
  pendiente: {
    className: "status-pending",
    icon: Clock,
    label: "Pendiente",
  },
  en_proceso: {
    className: "status-progress",
    icon: Package,
    label: "En Proceso",
  },
  enviado: {
    className: "status-shipped",
    icon: Truck,
    label: "Enviado",
  },
  completado: {
    className: "status-completed",
    icon: CheckCircle,
    label: "Completado",
  },
};

export default function RecentOrders() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="table-card">
      {/* Header */}
      <div className="table-header">
        <div>
          <h3 className="table-title">Pedidos Recientes</h3>
          <p className="table-subtitle">Últimos pedidos realizados</p>
        </div>
        <button className="btn btn-primary">
          Ver Todos
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead className="table-head">
            <tr>
              {[
                "Pedido",
                "Cliente",
                "Tipo",
                "Total",
                "Estado",
                "Fecha",
                "",
              ].map((header) => (
                <th key={header} className="table-head-cell">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="table-body">
            {orders.map((order, index) => {
              const status = statusConfig[order.status];
              const isHovered = hoveredRow === index;

              return (
                <tr
                  key={order.id}
                  className={`table-row ${isHovered ? "bg-gray-50" : ""}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="table-cell">
                    <span className="order-id">{order.id}</span>
                  </td>

                  <td className="table-cell">
                    <span className="order-client">{order.client}</span>
                  </td>

                  <td className="table-cell">
                    <span className="order-type">{order.type}</span>
                  </td>

                  <td className="table-cell">
                    <span className="order-total">{order.total}</span>
                  </td>

                  <td className="table-cell">
                    <span className={`status-badge ${status.className}`}>
                      <status.icon size={16} />
                      {status.label}
                    </span>
                  </td>

                  <td className="table-cell">
                    <span className="order-date">{order.date}</span>
                  </td>

                  <td className="table-cell">
                    <button className="action-btn">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        <div className="status-legend">
          <div className="status-legend-item">
            <div className="status-dot status-dot-amber"></div>
            <span className="status-label">1 Pendiente</span>
          </div>
          <div className="status-legend-item">
            <div className="status-dot status-dot-purple"></div>
            <span className="status-label">1 En Proceso</span>
          </div>
          <div className="status-legend-item">
            <div className="status-dot status-dot-green"></div>
            <span className="status-label">2 Completados</span>
          </div>
        </div>

        <div className="table-info">Mostrando 5 de 156 pedidos</div>
      </div>
    </div>
  );
}
