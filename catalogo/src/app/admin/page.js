"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, LogOut, ShoppingBag, History, User, Phone, Mail, DollarSign } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    costPrice: 0,
    cashPrice: 0,
    transferPrice: 0,
    image: ''
  });

  const [activeTab, setActiveTab] = useState('products');
  const [sales, setSales] = useState([]);
  const [showManualSaleModal, setShowManualSaleModal] = useState(false);
  const [manualSaleError, setManualSaleError] = useState('');
  const [manualSaleForm, setManualSaleForm] = useState({
    customer_name: '',
    customer_phone: '',
    items: [], // [{id, name, quantity, price}]
    payment_method: 'efectivo',
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      fetchProducts();
      fetchSales();
    }
  }, [router, session?.user?.role, status]);

  async function fetchSales() {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Failed to fetch sales", err);
    }
  }


  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['stock', 'costPrice', 'cashPrice', 'transferPrice'].includes(name) 
        ? Number(value) 
        : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      stock: 0,
      costPrice: 0,
      cashPrice: 0,
      transferPrice: 0,
      image: ''
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setEditingId(product.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Failed to save product", err);
      setLoading(false);
    }
  };

  const updateStock = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    if (newStock === product.stock) return;

    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, stock: newStock })
      });
      await fetchProducts();
    } catch (err) {
      console.error("Failed to update stock", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    setLoading(true);
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      setLoading(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="admin-header">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestiona los productos de tu catálogo</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary">
            <ArrowLeft size={18} />
            Volver al Catálogo
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-danger">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: 'auto' }}
        >
          <ShoppingBag size={18} />
          Productos
        </button>
        <button 
          onClick={() => setActiveTab('sales')} 
          className={`btn ${activeTab === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: 'auto' }}
        >
          <History size={18} />
          Ventas y Registros
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="card animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editingId ? <Edit size={20} /> : <Plus size={20} />}
              {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre del Producto</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock / Cantidad</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio de Lista (Costo)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="costPrice" 
                    value={formData.costPrice} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Efectivo</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="cashPrice" 
                    value={formData.cashPrice} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Transferencia</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="transferPrice" 
                    value={formData.transferPrice} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagen desde Google Drive</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="image" 
                  value={formData.image || ''} 
                  onChange={handleInputChange} 
                  placeholder="HAND GRIP.png, ID del archivo o URL de Drive"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  La app busca en tu carpeta pública de Drive. Puedes dejar el nombre del archivo, pegar el ID o una URL de Google Drive.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto' }}>
                  <Save size={18} />
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ width: 'auto' }}>
                    <X size={18} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Productos Existentes</h2>
            
            {loading && !products.length ? (
              <div className="loader-container" style={{ minHeight: '200px' }}>
                <div className="loader"></div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '1rem 0' }}>Nombre</th>
                      <th>Stock</th>
                      <th>Costo</th>
                      <th>Efectivo</th>
                      <th>Transferencia</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid rgba(48, 54, 61, 0.5)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: '600' }}>{product.name}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button 
                              onClick={() => updateStock(product, -1)}
                              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'white', backgroundColor: 'transparent' }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '20px', textAlign: 'center', color: product.stock <= 0 ? 'var(--danger-color)' : 'inherit', fontWeight: product.stock <= 0 ? 'bold' : 'normal' }}>
                              {product.stock}
                            </span>
                            <button 
                              onClick={() => updateStock(product, 1)}
                              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'white', backgroundColor: 'transparent' }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>${product.costPrice}</td>
                        <td>${product.cashPrice}</td>
                        <td>${product.transferPrice}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleEdit(product)}
                              className="btn btn-secondary"
                              style={{ padding: '0.5rem', width: 'auto' }}
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="btn btn-danger"
                              style={{ padding: '0.5rem', width: 'auto' }}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!products.length && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                          No hay productos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Historial de Ventas</h2>
            <button 
              onClick={() => setShowManualSaleModal(true)} 
              className="btn btn-primary"
              style={{ width: 'auto' }}
            >
              <Plus size={18} />
              Registrar Venta Manual (Local)
            </button>
          </div>

          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem 0' }}>Fecha</th>
                    <th>Cliente</th>
                    <th>Origen</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(48, 54, 61, 0.5)' }}>
                      <td style={{ padding: '1rem 0', fontSize: '0.85rem' }}>
                        {new Date(sale.created_at).toLocaleString('es-AR')}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{sale.customer_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sale.customer_phone}</div>
                      </td>
                      <td>
                        <span className={`badge ${sale.source === 'web' ? 'badge-primary' : 'badge-secondary'}`}>
                          {sale.source === 'web' ? 'Web' : 'Local'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '250px' }}>
                        <div style={{ fontSize: '0.85rem' }}>
                          {sale.items.map((item, idx) => (
                            <div key={idx}>{item.quantity}x {item.name}</div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                        ${sale.total_amount}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
                          {sale.payment_method}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manual Sale Modal */}
      {showManualSaleModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Registrar Venta Local</h2>
              <button onClick={() => setShowManualSaleModal(false)} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setManualSaleError('');
              try {
                const res = await fetch('/api/sales', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...manualSaleForm,
                    source: 'local'
                  })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  throw new Error(data.error || 'No pudimos registrar la venta.');
                }
                if (res.ok) {
                  setShowManualSaleModal(false);
                  setManualSaleError('');
                  setManualSaleForm({ customer_name: '', customer_phone: '', items: [], payment_method: 'efectivo', notes: '' });
                  fetchSales();
                  fetchProducts();
                }
              } catch (err) {
                console.error(err);
                setManualSaleError(err.message || 'No pudimos registrar la venta.');
              } finally {
                setLoading(false);
              }
            }}>
              {manualSaleError && (
                <div
                  style={{
                    backgroundColor: 'rgba(248, 81, 73, 0.1)',
                    color: 'var(--danger-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  {manualSaleError}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Nombre del Cliente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={manualSaleForm.customer_name}
                  onChange={e => setManualSaleForm({...manualSaleForm, customer_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={manualSaleForm.customer_phone}
                  onChange={e => setManualSaleForm({...manualSaleForm, customer_phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Productos (Seleccionar)</label>
                <select 
                  className="form-control"
                  onChange={(e) => {
                    const prod = products.find(p => p.id == e.target.value);
                    if (prod && !manualSaleForm.items.find(i => i.id === prod.id)) {
                      setManualSaleForm({
                        ...manualSaleForm,
                        items: [...manualSaleForm.items, { id: prod.id, name: prod.name, quantity: 1, price: prod.cashPrice }]
                      });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">-- Seleccionar producto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                {manualSaleForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                    <span>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        style={{ width: '60px', padding: '0.2rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}
                        value={item.quantity}
                        onChange={e => {
                          const newItems = [...manualSaleForm.items];
                          newItems[idx].quantity = Number(e.target.value);
                          setManualSaleForm({...manualSaleForm, items: newItems});
                        }}
                      />
                      <button type="button" onClick={() => {
                        const newItems = manualSaleForm.items.filter((_, i) => i !== idx);
                        setManualSaleForm({...manualSaleForm, items: newItems});
                      }} style={{ color: 'var(--danger-color)' }}><X size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <select 
                  className="form-control"
                  value={manualSaleForm.payment_method}
                  onChange={e => setManualSaleForm({...manualSaleForm, payment_method: e.target.value})}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading || manualSaleForm.items.length === 0}>
                {loading ? 'Registrando...' : 'Confirmar Venta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
