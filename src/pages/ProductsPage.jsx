import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Box,
  Eye,
  X,
  Save,
  ChevronDown,
  Upload,
} from "lucide-react";

// Datos fake de productos
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Rótulo Luminoso LED 100x50cm",
    description:
      "Rótulo luminoso con iluminación LED de alta eficiencia. Perfecto para escaparates y fachadas.",
    price: 450.0,
    cost: 280.0,
    category: "Luminosos",
    stock: 15,
    minStock: 5,
    status: "active",
    image: null,
    sku: "ROT-LUM-10050",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Vinilo Escaparate Premium",
    description:
      "Vinilo de alta calidad para escaparates. Resistente a la intemperie y fácil de instalar.",
    price: 120.0,
    cost: 65.0,
    category: "Vinilos",
    stock: 42,
    minStock: 10,
    status: "active",
    image: null,
    sku: "VIN-ESC-PRE",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Letras Corpóreas PVC 30cm",
    description:
      "Letras en 3D fabricadas en PVC espumado. Ideales para interior y exterior.",
    price: 89.0,
    cost: 52.0,
    category: "Letras",
    stock: 8,
    minStock: 8,
    status: "low_stock",
    image: null,
    sku: "LET-COR-30",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Panel Publicitario Aluminio 200x100cm",
    description:
      "Panel resistente en aluminio composite. Incluye soporte para instalación.",
    price: 320.0,
    cost: 195.0,
    category: "Paneles",
    stock: 0,
    minStock: 3,
    status: "out_of_stock",
    image: null,
    sku: "PAN-PUB-200100",
    createdAt: "2024-02-10",
  },
  {
    id: 5,
    name: "Rótulo Metálico Acero Inoxidable",
    description:
      "Elegante rótulo fabricado en acero inoxidable cepillado. Acabado profesional.",
    price: 580.0,
    cost: 365.0,
    category: "Metálicos",
    stock: 6,
    minStock: 3,
    status: "active",
    image: null,
    sku: "ROT-MET-ACI",
    createdAt: "2024-02-15",
  },
  {
    id: 6,
    name: "Banderola Doble Cara 150x50cm",
    description:
      "Banderola visible desde ambos lados. Estructura de aluminio y lona de alta resistencia.",
    price: 180.0,
    cost: 110.0,
    category: "Banderolas",
    stock: 23,
    minStock: 5,
    status: "active",
    image: null,
    sku: "BAN-DOB-15050",
    createdAt: "2024-03-01",
  },
  {
    id: 7,
    name: "Neón Flex Personalizado",
    description:
      "Letras o figuras en neón flex LED. Bajo consumo y alta durabilidad.",
    price: 295.0,
    cost: 175.0,
    category: "Neón",
    stock: 12,
    minStock: 5,
    status: "active",
    image: null,
    sku: "NEO-FLEX-CUST",
    createdAt: "2024-03-10",
  },
  {
    id: 8,
    name: "Señalización Corporativa Kit",
    description:
      "Kit completo de señalización para oficinas. Incluye placas direccionales y señales de seguridad.",
    price: 245.0,
    cost: 148.0,
    category: "Señalización",
    stock: 18,
    minStock: 5,
    status: "active",
    image: null,
    sku: "SEN-CORP-KIT",
    createdAt: "2024-03-15",
  },
];

const CATEGORIES = [
  "Luminosos",
  "Vinilos",
  "Letras",
  "Paneles",
  "Metálicos",
  "Banderolas",
  "Neón",
  "Señalización",
  "Otros",
];

const STATUS_CONFIG = {
  active: { label: "Activo", className: "status-active", color: "#22C55E" },
  inactive: {
    label: "Inactivo",
    className: "status-inactive",
    color: "#6B7280",
  },
  low_stock: {
    label: "Stock Bajo",
    className: "status-warning",
    color: "#F59E0B",
  },
  out_of_stock: {
    label: "Sin Stock",
    className: "status-error",
    color: "#EF4444",
  },
};

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    category: "",
    stock: "",
    minStock: "",
    sku: "",
    status: "active",
    image: null,
  });

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, products]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        category: product.category,
        stock: product.stock,
        minStock: product.minStock,
        sku: product.sku,
        status: product.status,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        cost: "",
        category: "",
        stock: "",
        minStock: "",
        sku: "",
        status: "active",
        image: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
    };

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p,
        ),
      );
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDeleteProduct = (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return "out_of_stock";
    if (stock <= minStock) return "low_stock";
    return "active";
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div>
          <h2 className="products-title">Productos</h2>
          <p className="products-subtitle">
            Gestiona tu catálogo de productos y servicios
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="products-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="products-filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="products-select"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="products-select"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="low_stock">Stock Bajo</option>
            <option value="out_of_stock">Sin Stock</option>
            <option value="inactive">Inactivo</option>
          </select>

          <div className="products-view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Products Summary */}
      <div className="products-summary">
        <div className="summary-card">
          <Package size={24} />
          <div>
            <span className="summary-value">{products.length}</span>
            <span className="summary-label">Total Productos</span>
          </div>
        </div>
        <div className="summary-card">
          <Tag size={24} />
          <div>
            <span className="summary-value">
              {products.filter((p) => p.status === "active").length}
            </span>
            <span className="summary-label">Activos</span>
          </div>
        </div>
        <div className="summary-card warning">
          <Box size={24} />
          <div>
            <span className="summary-value">
              {products.filter((p) => p.status === "low_stock").length}
            </span>
            <span className="summary-label">Stock Bajo</span>
          </div>
        </div>
        <div className="summary-card error">
          <Box size={24} />
          <div>
            <span className="summary-value">
              {products.filter((p) => p.status === "out_of_stock").length}
            </span>
            <span className="summary-label">Sin Stock</span>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`products-container ${viewMode}`}>
        {filteredProducts.length === 0 ? (
          <div className="products-empty">
            <Package size={48} />
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros o crea un nuevo producto</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
                <span
                  className={`product-status ${STATUS_CONFIG[product.status].className}`}
                >
                  {STATUS_CONFIG[product.status].label}
                </span>
              </div>

              <div className="product-content">
                <div className="product-header">
                  <div>
                    <span className="product-sku">{product.sku}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-category">{product.category}</span>
                  </div>
                  <div className="product-price">
                    <span className="price">€{product.price.toFixed(2)}</span>
                    <span className="cost">
                      Coste: €{product.cost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <div className="product-stock">
                    <Box size={16} />
                    <span
                      className={
                        product.stock <= product.minStock
                          ? product.stock === 0
                            ? "stock-error"
                            : "stock-warning"
                          : ""
                      }
                    >
                      {product.stock} unidades
                    </span>
                    <span className="stock-min">Min: {product.minStock}</span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleOpenModal(product)}
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Rótulo Luminoso LED 100x50cm"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe las características del producto..."
                  />
                </div>

                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: ROT-LUM-10050"
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona categoría</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Precio de Venta (€) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Coste (€) *</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Actual *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Mínimo *</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Imagen del Producto</label>
                  <div className="image-upload">
                    <div className="image-upload-preview">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <Upload size={32} />
                          <span>Arrastra una imagen o haz clic para subir</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
