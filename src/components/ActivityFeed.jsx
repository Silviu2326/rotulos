import React from "react";
import {
  Plus,
  Edit3,
  CheckCircle2,
  Truck,
  UserPlus,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "pedido_nuevo",
    message: "Nuevo pedido #R-4521",
    details: "Restaurante El Sabor",
    time: "Hace 5 min",
    icon: Plus,
    className: "activity-icon-green",
  },
  {
    id: 2,
    type: "editor_uso",
    message: "Diseño completado",
    details: "Rótulo Luminoso",
    time: "Hace 15 min",
    icon: Edit3,
    className: "activity-icon-purple",
  },
  {
    id: 3,
    type: "pedido_completado",
    message: "Pedido completado",
    details: "#R-4519 - Café Central",
    time: "Hace 30 min",
    icon: CheckCircle2,
    className: "activity-icon-blue",
  },
  {
    id: 4,
    type: "envio",
    message: "Pedido enviado",
    details: "#R-4517 - Panadería San Juan",
    time: "Hace 1 hora",
    icon: Truck,
    className: "activity-icon-amber",
  },
  {
    id: 5,
    type: "cliente_nuevo",
    message: "Nuevo cliente",
    details: "Ferretería La Tuerca",
    time: "Hace 2 horas",
    icon: UserPlus,
    className: "activity-icon-pink",
  },
  {
    id: 6,
    type: "mensaje",
    message: "Nueva consulta",
    details: "Rótulos LED exterior",
    time: "Hace 3 horas",
    icon: MessageSquare,
    className: "activity-icon-gray",
  },
];

export default function ActivityFeed() {
  return (
    <div className="activity-card">
      {/* Header */}
      <div className="activity-header">
        <div>
          <h3 className="activity-title">Actividad Reciente</h3>
          <p className="activity-subtitle">Últimas acciones</p>
        </div>

        <div className="activity-indicator"></div>
      </div>

      {/* Activity List */}
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            {/* Icon */}
            <div className={`activity-icon ${activity.className}`}>
              <activity.icon size={22} strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <p className="activity-details">{activity.details}</p>
              <p className="activity-time">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="activity-footer">
        <button className="activity-btn">
          Ver Historial Completo
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
