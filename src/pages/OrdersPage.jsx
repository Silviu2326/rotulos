import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Download,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import '../styles/orders.css';

const orders = [
  { 
    id: '#R-4521', 
    client: 'Restaurante El Sabor', 
    email: 'contacto@elsabor.com',
    type: 'Rótulo Luminoso', 
    size: '120x60 cm',
    material: 'Acero + LED',
    total: 450.00, 
    status: 'pendiente', 
    date: '2026-02-28',
    priority: 'alta'
  },
  { 
    id: '#R-4520', 
    client: 'Tienda Moda Urbana', 
    email: 'pedidos@modaurbana.es',
    type: 'Vinilo Escaparate', 
    size: '200x150 cm',
    material: 'Vinilo impreso',
    total: 120.00, 
    status: 'en_proceso', 
    date: '2026-02-28',
    priority: 'normal'
  },
  { 
    id: '#R-4519', 
    client: 'Café Central', 
    email: 'info@cafecentral.com',
    type: 'Letras Corpóreas', 
    size: '80x40 cm',
    material: 'PVC expandido',
    total: 890.00, 
    status: 'completado', 
    date: '2026-02-27',
    priority: 'alta'
  },
  { 
    id: '#R-4518', 
    client: 'Gimnasio FitLife', 
    email: 'gerencia@fitlife.es',
    type: 'Panel Publicitario', 
    size: '300x200 cm',
    material: 'Aluminio compuesto',
    total: 320.00, 
    status: 'completado', 
    date: '2026-02-27',
    priority: 'normal'
  },
  { 
    id: '#R-4517', 
    client: 'Panadería San Juan', 
    email: 'sanjuan@email.com',
    type: 'Rótulo Metálico', 
    size: '100x50 cm',
    material: 'Acero inoxidable',
    total: 280.00, 
    status: 'enviado', 
    date: '2026-02-26',
    priority: 'normal'
  },
  { 
    id: '#R-4516', 
    client: 'Ferretería La Tuerca', 
    email: 'latuerca@ferreteria.es',
    type: 'Señalética', 
    size: '60x40 cm',
    material: 'PVC rígido',
    total: 85.00, 
    status: 'completado', 
    date: '2026-02-25',
    priority: 'baja'
  },
  { 
    id: '#R-4515', 
    client: 'Peluquería Estilo', 
    email: 'citas@estilopelu.com',
    type: 'Vinilo Decorativo', 
    size: '150x100 cm',
    material: 'Vinilo de corte',
    total: 145.00, 
    status: 'en_proceso', 
    date: '2026-02-25',
    priority: 'normal'
  },
  { 
    id: '#R-4514', 
    client: 'Taller Mecánico Rápido', 
    email: 'taller@rapidomec.com',
    type: 'Rótulo LED', 
    size: '150x80 cm',
    material: 'Aluminio + LED',
    total: 650.00, 
    status: 'cancelado', 
    date: '2026-02-24',
    priority: 'normal'
  },
  { 
    id: '#R-4513', 
    client: 'Clínica Dental Sonrisa', 
    email: 'info@sonrisadental.es',
    type: 'Letras Retroiluminadas', 
    size: '100x60 cm',
    material: 'Acero + LED',
    total: 1200.00, 
    status: 'completado', 
    date: '2026-02-24',
    priority: 'alta'
  },
  { 
    id: '#R-4512', 
    client: 'Bar La Esquina', 
    email: 'laesquina@bar.com',
    type: 'Pizarra LED', 
    size: '80x60 cm',
    material: 'Madera + LED',
    total: 180.00, 
    status: 'pendiente', 
    date: '2026-02-23',
    priority: 'baja'
  },
];

const statusConfig = {
  pendiente: { 
    className: 'orders-status pending', 
    icon: Clock, 
    label: 'Pendiente' 
  },
  en_proceso: { 
    className: 'orders-status processing', 
    icon: Package, 
    label: 'En Proceso' 
  },
  enviado: { 
    className: 'orders-status shipped', 
    icon: Truck, 
    label: 'Enviado' 
  },
  completado: { 
    className: 'orders-status completed', 
    icon: CheckCircle2, 
    label: 'Completado' 
  },
  cancelado: { 
    className: 'orders-status cancelled', 
    icon: XCircle, 
    label: 'Cancelado' 
  },
};

const priorityConfig = {
  alta: 'orders-priority high',
  normal: 'orders-priority normal',
  baja: 'orders-priority low',
};

export default function OrdersPage({ onViewOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const totalIngresos = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="orders-title-section">
          <h1>Pedidos</h1>
          <p>Gestiona todos los pedidos de rótulos</p>
        </div>
        <button className="orders-new-btn">
          <Plus size={20} />
          Nuevo Pedido
        </button>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats-grid">
        <div className="orders-stat-card">
          <p className="orders-stat-label">Total Pedidos</p>
          <p className="orders-stat-value default">{orders.length}</p>
        </div>
        <div className="orders-stat-card">
          <p className="orders-stat-label">Pendientes</p>
          <p className="orders-stat-value pending">
            {orders.filter(o => o.status === 'pendiente').length}
          </p>
        </div>
        <div className="orders-stat-card">
          <p className="orders-stat-label">En Proceso</p>
          <p className="orders-stat-value processing">
            {orders.filter(o => o.status === 'en_proceso').length}
          </p>
        </div>
        <div className="orders-stat-card">
          <p className="orders-stat-label">Ingresos Totales</p>
          <p className="orders-stat-value revenue">
            €{totalIngresos.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="orders-filters-inner">
          {/* Search */}
          <div className="orders-search-wrapper">
            <Search className="orders-search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente, ID o tipo de rótulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="orders-search-input"
            />
          </div>

          {/* Status Filter */}
          <div className="orders-filter-group">
            <Filter size={20} className="orders-filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="orders-filter-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="enviado">Enviado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Export */}
          <button className="orders-export-btn">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="orders-table-container">
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="orders-checkbox"
                  />
                </th>
                <th>
                  <div className="orders-table-header-content">
                    Pedido
                    <ArrowUpDown size={16} className="orders-table-header-icon" />
                  </div>
                </th>
                <th>Cliente</th>
                <th>Tipo de Rótulo</th>
                <th>Detalles</th>
                <th>Total</th>
                <th>Estado</th>
                <th>
                  <div className="orders-table-header-content">
                    Fecha
                    <Calendar size={16} className="orders-table-header-icon" />
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <tr key={order.id} className="orders-table-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="orders-checkbox"
                      />
                    </td>
                    <td>
                      <div className="orders-id-cell">
                        <span className="orders-id">{order.id}</span>
                        <span className={priorityConfig[order.priority]}>
                          {order.priority}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="orders-client-name">{order.client}</p>
                        <p className="orders-client-email">{order.email}</p>
                      </div>
                    </td>
                    <td>
                      <p className="orders-type">{order.type}</p>
                    </td>
                    <td>
                      <p className="orders-details-size">{order.size}</p>
                      <p className="orders-details-material">{order.material}</p>
                    </td>
                    <td>
                      <p className="orders-total">€{order.total.toFixed(2)}</p>
                    </td>
                    <td>
                      <span className={status.className}>
                        <status.icon size={14} />
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <p className="orders-date">{order.date}</p>
                    </td>
                    <td>
                      <div className="orders-actions">
                        <button className="orders-action-btn view" onClick={() => onViewOrder(order.id)}>
                          <Eye size={18} />
                        </button>
                        <button className="orders-action-btn edit">
                          <Edit3 size={18} />
                        </button>
                        <button className="orders-action-btn delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="orders-pagination">
          <p className="orders-pagination-info">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
          </p>
          <div className="orders-pagination-controls">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="orders-pagination-btn"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`orders-pagination-page ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="orders-pagination-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
