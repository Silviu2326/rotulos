import React from 'react';
import {
  ArrowLeft,
  Printer,
  Edit3,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Tag,
  Maximize2,
  Layers,
  Palette,
  MessageSquare,
  Send,
  AlertCircle,
  Download,
  Copy
} from 'lucide-react';
import '../styles/order-detail.css';

const orderData = {
  id: '#R-4521',
  status: 'en_proceso',
  date: '2026-02-28',
  priority: 'alta',
  customer: {
    name: 'Restaurante El Sabor',
    email: 'contacto@elsabor.com',
    phone: '+34 612 345 678',
    address: 'Calle Mayor 123, 28001 Madrid, España'
  },
  product: {
    name: 'Rótulo Luminoso',
    type: 'Letras corpóreas retroiluminadas',
    size: '120x60 cm',
    material: 'Acero inoxidable + LEDs',
    color: 'Blanco cálido',
    description: 'Rótulo para fachada principal con iluminación LED interior. Incluye transformador y cableado.'
  },
  pricing: {
    subtotal: 380.00,
    iva: 79.80,
    envio: 0.00,
    descuento: 10.00,
    total: 450.00
  },
  timeline: [
    { 
      status: 'completed', 
      title: 'Pedido recibido', 
      description: 'El pedido ha sido registrado en el sistema',
      date: '28 Feb 2026, 09:30',
      icon: FileText
    },
    { 
      status: 'completed', 
      title: 'Pago confirmado', 
      description: 'Pago de €450.00 recibido',
      date: '28 Feb 2026, 10:15',
      icon: CreditCard
    },
    { 
      status: 'current', 
      title: 'En producción', 
      description: 'El rótulo está siendo fabricado',
      date: 'En curso',
      icon: Package
    },
    { 
      status: 'pending', 
      title: 'Control de calidad', 
      description: 'Revisión final del producto',
      date: 'Pendiente',
      icon: CheckCircle2
    },
    { 
      status: 'pending', 
      title: 'Envío', 
      description: 'Preparación para envío',
      date: 'Pendiente',
      icon: Truck
    }
  ],
  notes: [
    {
      author: 'María González',
      date: '28 Feb 2026, 11:00',
      text: 'Cliente solicita entrega preferente. Confirmar fecha exacta de instalación.'
    },
    {
      author: 'Carlos Ruiz',
      date: '28 Feb 2026, 14:30',
      text: 'Diseño aprobado por el cliente. Se inicia producción.'
    }
  ]
};

const statusConfig = {
  pendiente: { 
    className: 'order-detail-status pending', 
    icon: Clock, 
    label: 'Pendiente' 
  },
  en_proceso: { 
    className: 'order-detail-status processing', 
    icon: Package, 
    label: 'En Proceso' 
  },
  enviado: { 
    className: 'order-detail-status shipped', 
    icon: Truck, 
    label: 'Enviado' 
  },
  completado: { 
    className: 'order-detail-status completed', 
    icon: CheckCircle2, 
    label: 'Completado' 
  },
  cancelado: { 
    className: 'order-detail-status cancelled', 
    icon: XCircle, 
    label: 'Cancelado' 
  },
};

const priorityConfig = {
  alta: { className: 'order-detail-priority high', label: 'Prioridad Alta', icon: AlertCircle },
  normal: { className: 'order-detail-priority normal', label: 'Prioridad Normal', icon: Tag },
  baja: { className: 'order-detail-priority low', label: 'Prioridad Baja', icon: Tag },
};

export default function OrderDetailPage({ orderId = orderData.id, onBack }) {
  const status = statusConfig[orderData.status];
  const priority = priorityConfig[orderData.priority];

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderData.id);
  };

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div className="order-detail-title-section">
          <button className="order-detail-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="order-detail-title-group">
            <h1>
              Pedido <span className="order-detail-id">{orderData.id}</span>
              <span className={status.className} style={{ marginLeft: '0.75rem' }}>
                <status.icon size={14} />
                {status.label}
              </span>
            </h1>
            <div className="order-detail-meta">
              <span className="order-detail-date">
                <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                {orderData.date}
              </span>
              <span className={priority.className}>
                <priority.icon size={14} />
                {priority.label}
              </span>
            </div>
          </div>
        </div>

        <div className="order-detail-actions">
          <button className="order-detail-btn order-detail-btn-secondary" onClick={handleCopyId}>
            <Copy size={18} />
            Copiar ID
          </button>
          <button className="order-detail-btn order-detail-btn-secondary">
            <Printer size={18} />
            Imprimir
          </button>
          <button className="order-detail-btn order-detail-btn-primary">
            <Edit3 size={18} />
            Editar Pedido
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="order-detail-grid">
        {/* Left Column */}
        <div className="order-detail-main">
          {/* Product Info */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <Package size={20} />
              </div>
              <h2 className="order-detail-card-title">Información del Producto</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-product">
                <div className="order-detail-product-image">
                  <Package size={40} />
                </div>
                <div className="order-detail-product-info">
                  <h3 className="order-detail-product-name">{orderData.product.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                    {orderData.product.type}
                  </p>
                  <div className="order-detail-product-specs">
                    <span className="order-detail-product-spec">
                      <Maximize2 size={14} />
                      {orderData.product.size}
                    </span>
                    <span className="order-detail-product-spec">
                      <Layers size={14} />
                      {orderData.product.material}
                    </span>
                    <span className="order-detail-product-spec">
                      <Palette size={14} />
                      {orderData.product.color}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
                <p className="order-detail-info-label">Descripción</p>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.6', margin: '0.5rem 0 0 0' }}>
                  {orderData.product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <Clock size={20} />
              </div>
              <h2 className="order-detail-card-title">Estado del Pedido</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-timeline">
                {orderData.timeline.map((item, index) => (
                  <div key={index} className="order-detail-timeline-item">
                    <div className={`order-detail-timeline-icon ${item.status}`}>
                      <item.icon size={18} />
                    </div>
                    <div className="order-detail-timeline-content">
                      <p className="order-detail-timeline-title">{item.title}</p>
                      <p className="order-detail-timeline-desc">{item.description}</p>
                      <p className="order-detail-timeline-date">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <CreditCard size={20} />
              </div>
              <h2 className="order-detail-card-title">Desglose de Precios</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-prices">
                <div className="order-detail-price-row">
                  <span className="order-detail-price-label">Subtotal</span>
                  <span className="order-detail-price-value">€{orderData.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="order-detail-price-row">
                  <span className="order-detail-price-label">IVA (21%)</span>
                  <span className="order-detail-price-value">€{orderData.pricing.iva.toFixed(2)}</span>
                </div>
                <div className="order-detail-price-row">
                  <span className="order-detail-price-label">Envío</span>
                  <span className="order-detail-price-value">
                    {orderData.pricing.envio === 0 ? 'Gratis' : `€${orderData.pricing.envio.toFixed(2)}`}
                  </span>
                </div>
                {orderData.pricing.descuento > 0 && (
                  <div className="order-detail-price-row">
                    <span className="order-detail-price-label">Descuento</span>
                    <span className="order-detail-price-value" style={{ color: '#059669' }}>
                      -€{orderData.pricing.descuento.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="order-detail-price-divider"></div>
                <div className="order-detail-price-row total">
                  <span className="order-detail-price-label">Total</span>
                  <span className="order-detail-price-value">€{orderData.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <MessageSquare size={20} />
              </div>
              <h2 className="order-detail-card-title">Notas y Comentarios</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-notes-list">
                {orderData.notes.map((note, index) => (
                  <div key={index} className="order-detail-note">
                    <div className="order-detail-note-header">
                      <span className="order-detail-note-author">{note.author}</span>
                      <span className="order-detail-note-date">{note.date}</span>
                    </div>
                    <p className="order-detail-note-text">{note.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <textarea 
                  className="order-detail-note-input" 
                  placeholder="Añadir una nota..."
                ></textarea>
                <button 
                  className="order-detail-btn order-detail-btn-primary" 
                  style={{ marginTop: '0.75rem', width: '100%' }}
                >
                  <Send size={18} />
                  Añadir Nota
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="order-detail-sidebar">
          {/* Customer Info */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <User size={20} />
              </div>
              <h2 className="order-detail-card-title">Información del Cliente</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-customer">
                <div className="order-detail-customer-avatar">
                  {orderData.customer.name.charAt(0)}
                </div>
                <div className="order-detail-customer-info">
                  <h3>{orderData.customer.name}</h3>
                  <p>Cliente desde 2024</p>
                </div>
              </div>
              <div className="order-detail-customer-contact">
                <div className="order-detail-contact-item">
                  <Mail size={16} />
                  <span>{orderData.customer.email}</span>
                </div>
                <div className="order-detail-contact-item">
                  <Phone size={16} />
                  <span>{orderData.customer.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <MapPin size={20} />
              </div>
              <h2 className="order-detail-card-title">Dirección de Entrega</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-address">
                <p className="order-detail-address-line" style={{ fontWeight: 600, color: '#374151' }}>
                  {orderData.customer.name}
                </p>
                <p className="order-detail-address-line">{orderData.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <Layers size={20} />
              </div>
              <h2 className="order-detail-card-title">Acciones Rápidas</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-quick-actions">
                <button className="order-detail-quick-btn">
                  <Download size={20} />
                  <span>Factura</span>
                </button>
                <button className="order-detail-quick-btn">
                  <Send size={20} />
                  <span>Enviar</span>
                </button>
                <button className="order-detail-quick-btn">
                  <Printer size={20} />
                  <span>Imprimir</span>
                </button>
                <button className="order-detail-quick-btn">
                  <FileText size={20} />
                  <span>Albarán</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="order-detail-card">
            <div className="order-detail-card-header">
              <div className="order-detail-card-icon">
                <FileText size={20} />
              </div>
              <h2 className="order-detail-card-title">Detalles del Pedido</h2>
            </div>
            <div className="order-detail-card-body">
              <div className="order-detail-info-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="order-detail-info-item">
                  <span className="order-detail-info-label">ID del Pedido</span>
                  <span className="order-detail-info-value">{orderData.id}</span>
                </div>
                <div className="order-detail-info-item">
                  <span className="order-detail-info-label">Fecha de Creación</span>
                  <span className="order-detail-info-value">{orderData.date}</span>
                </div>
                <div className="order-detail-info-item">
                  <span className="order-detail-info-label">Método de Pago</span>
                  <span className="order-detail-info-value">Tarjeta de crédito</span>
                </div>
                <div className="order-detail-info-item">
                  <span className="order-detail-info-label">Tiempo Estimado</span>
                  <span className="order-detail-info-value">5-7 días hábiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
