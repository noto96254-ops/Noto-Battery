import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users as UsersIcon, 
  ShoppingCart as OrdersIcon, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Loader2,
  X,
  ChevronRight,
  Tags,
  LayoutGrid,
  FileText,
  Download
} from 'lucide-react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInvoicePDF, generateOrderSummaryPDF, generateStockReportPDF } from '../utils/pdfGenerator';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'Overview';
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', description: '', images: '', countInStock: 0 });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phone: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Products and Categories are public, they should usually succeed
      const [prodRes, catRes] = await Promise.all([
        API.get('/products').catch(err => { console.error('Products fetch failed:', err); return { data: [] }; }),
        API.get('/categories').catch(err => { console.error('Categories fetch failed:', err); return { data: [] }; })
      ]);
      
      setProducts(prodRes.data);
      setCategories(catRes.data);
      
      if (catRes.data.length > 0) {
        setNewProduct(prev => ({ ...prev, category: catRes.data[0].name }));
      }

      // Orders and Users require admin auth, they might fail if auth is invalid
      const [orderRes, userRes] = await Promise.all([
        API.get('/orders').catch(err => { console.error('Orders fetch failed:', err); return { data: [] }; }),
        API.get('/users').catch(err => { console.error('Users fetch failed:', err); return { data: [] }; })
      ]);

      setOrders(orderRes.data);
      setUsers(userRes.data);

    } catch (error) {
      console.error('Unexpected error in fetchAdminData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await API.post('/categories', { name: newCategoryName });
      setCategories([...categories, data]);
      setNewCategoryName('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category? Products already assigned will remain but this category option will be removed.')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleUpload = async (e, type = 'new') => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'new') {
        setNewProduct({ ...newProduct, images: data.url });
      } else {
        setEditingProduct({ ...editingProduct, images: [data.url] });
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.category) return alert('Please select a category');
    setSubmitting(true);
    try {
      const { data } = await API.post('/products', {
        ...newProduct,
        images: [newProduct.images]
      });
      setProducts([...products, data]);
      setShowAddModal(false);
      setNewProduct({ title: '', price: '', category: categories[0]?.name || '', description: '', images: '', countInStock: 0 });
    } catch (error) {
       alert('Error adding product');
    } finally {
       setSubmitting(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await API.put(`/products/${editingProduct._id}`, editingProduct);
      setProducts(products.map(p => p._id === data._id ? data : p));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/auth/add-admin', newAdmin);
      alert('New admin added successfully!');
      setShowAddAdminModal(false);
      setNewAdmin({ name: '', email: '', password: '', phone: '' });
      fetchAdminData(); // Refresh user list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add admin');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  // Group products by category
  const productsByCategory = categories.reduce((acc, cat) => {
    acc[cat.name] = products.filter(p => p.category === cat.name);
    return acc;
  }, {});
  
  // Add an "Uncategorized" section for any products that don't match existing categories
  const uncategorized = products.filter(p => !categories.find(c => c.name === p.category));
  if (uncategorized.length > 0) {
    productsByCategory['Uncategorized'] = uncategorized;
  }

  const stats = [
    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Orders', value: orders.length, icon: OrdersIcon, color: 'text-blue-500' },
    { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'text-purple-500' },
    { label: 'Active Products', value: products.length, icon: Package, color: 'text-orange-500' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color)' }}><Loader2 className="animate-spin text-primary-color" size={48} /></div>;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r p-6 hidden lg:block" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-2 mb-10">
           <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center text-white font-black" style={{ backgroundColor: 'var(--primary-color)' }}>N</div>
           <span className="font-black text-xl uppercase tracking-tight">Admin Panel</span>
        </div>
        <nav className="space-y-2">
           {[
             { name: 'Overview', icon: LayoutDashboard },
             { name: 'Products', icon: Package },
             { name: 'Categories', icon: Tags },
             { name: 'Orders', icon: OrdersIcon },
             { name: 'Users', icon: UsersIcon },
             { name: 'Reports', icon: FileText }
           ].map(tab => (
             <button 
               key={tab.name} 
               onClick={() => setActiveTab(tab.name)} 
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab.name ? 'text-white shadow-lg' : 'opacity-60 hover:opacity-100 hover:bg-primary-color/5'}`} 
               style={activeTab === tab.name ? { backgroundColor: 'var(--primary-color)' } : {}}
             >
               <tab.icon size={18} />
               <span>{tab.name}</span>
             </button>
           ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
           <h1 className="text-4xl font-black uppercase tracking-tighter">{activeTab}</h1>
           <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Administrator</p>
                 <p className="text-sm font-black">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-primary-color rounded-full flex items-center justify-center text-white font-black shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                 {user.name.charAt(0)}
              </div>
           </div>
        </header>

        <div className="animate-fade-in">
          {activeTab === 'Overview' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="card p-8 flex items-center justify-between group">
                     <div>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                     </div>
                     <div className={`p-4 rounded-2xl bg-gray-500/5 group-hover:scale-110 transition-transform ${stat.color}`}>
                        <stat.icon size={28} />
                     </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'Categories' && (
             <div className="space-y-6">
                <div className="card p-8">
                   <h2 className="text-xl font-black uppercase mb-6 tracking-tight">Management Control</h2>
                   <form onSubmit={handleAddCategory} className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="New Category Name..."
                        className="input-field flex-1"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <button type="submit" className="btn-primary flex items-center space-x-2">
                         <Plus size={18} />
                         <span>Add New</span>
                      </button>
                   </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {categories.map(cat => (
                     <div key={cat._id} className="card p-6 flex justify-between items-center group">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 rounded-xl bg-primary-color/10 flex items-center justify-center text-primary-color" style={{ color: 'var(--primary-color)' }}>
                              <Tags size={20} />
                           </div>
                           <span className="font-black uppercase tracking-tight text-sm">{cat.name}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'Products' && (
             <div className="space-y-12">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-black uppercase tracking-tight">Inventory Logistics</h2>
                   <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2 text-[10px] py-3">
                      <Plus size={18} />
                      <span>Add Product</span>
                   </button>
                </div>
                
                {Object.keys(productsByCategory).map(catName => (
                  <div key={catName} className="space-y-4">
                    <div className="flex items-center space-x-3 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                       <LayoutGrid size={18} className="text-primary-color" style={{ color: 'var(--primary-color)' }} />
                       <h3 className="font-black uppercase tracking-widest text-xs opacity-60">{catName}</h3>
                       <span className="text-[10px] bg-primary-color/10 px-2 py-0.5 rounded-full text-primary-color font-black">
                          {productsByCategory[catName].length} Items
                       </span>
                    </div>

                    <div className="card overflow-hidden">
                       <table className="w-full text-left">
                          <thead style={{ backgroundColor: 'var(--bg-color)' }}>
                             <tr>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Battery Model</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Pricing</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Controls</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                             {productsByCategory[catName].map(product => (
                               <tr key={product._id} className="hover:bg-primary-color/5 transition-colors">
                                  <td className="p-4">
                                     <div className="flex items-center space-x-4">
                                        <img src={product.images[0]} className="w-12 h-12 rounded-xl object-cover border shadow-sm" style={{ borderColor: 'var(--border-color)' }} />
                                        <span className="font-black text-sm uppercase tracking-tight">{product.title}</span>
                                     </div>
                                  </td>
                                  <td className="p-4 font-black">₹{product.price.toLocaleString()}</td>
                                  <td className="p-4">
                                     <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => { setEditingProduct(product); setShowEditModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit size={18}/></button>
                                        <button onClick={async () => { if(window.confirm('Delete?')){ await API.delete(`/products/${product._id}`); setProducts(products.filter(p => p._id !== product._id)); }}} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                                     </div>
                                  </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'Orders' && (
             <div className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight">Order Fulfillment</h2>
                <div className="card overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                         <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Order ID</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Customer</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Revenue</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                         {orders.map(order => (
                           <tr key={order._id} className="hover:bg-primary-color/5 transition-colors">
                              <td className="p-4 font-mono text-xs font-black">#{order._id.slice(-6).toUpperCase()}</td>
                              <td className="p-4 font-black uppercase text-xs tracking-tight">{order.user?.name || 'Guest'}</td>
                              <td className="p-4 font-black">₹{order.totalAmount.toLocaleString()}</td>
                              <td className="p-4">
                                 <div className="flex items-center space-x-3">
                                    <select 
                                      value={order.orderStatus} 
                                      onChange={async (e) => {
                                         const newStatus = e.target.value;
                                         await API.put(`/orders/${order._id}`, { orderStatus: newStatus });
                                         setOrders(orders.map(o => o._id === order._id ? {...o, orderStatus: newStatus} : o));
                                      }}
                                      className="bg-transparent border-2 p-2 rounded-xl text-[10px] font-black uppercase cursor-pointer focus:outline-none"
                                      style={{ borderColor: 'var(--border-color)' }}
                                    >
                                       <option className="text-black" value="Processing">Processing</option>
                                       <option className="text-black" value="Shipped">Shipped</option>
                                       <option className="text-black" value="Delivered">Delivered</option>
                                       <option className="text-black" value="Cancelled">Cancelled</option>
                                    </select>
                                    <button 
                                      onClick={() => generateInvoicePDF(order)}
                                      className="p-2 text-primary-color hover:bg-primary-color/10 rounded-lg transition-all"
                                      title="Download PDF Invoice"
                                    >
                                       <FileText size={18} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'Users' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-black uppercase tracking-tight">Authority Directory</h2>
                   <button onClick={() => setShowAddAdminModal(true)} className="btn-primary flex items-center space-x-2 text-[10px] py-3 px-6">
                      <Plus size={18} />
                      <span>Add Admin</span>
                   </button>
                </div>
                <div className="card overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="border-b" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                         <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Email</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40">Authority</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                         {users.map(u => (
                           <tr key={u._id} className="hover:bg-primary-color/5 transition-colors">
                              <td className="p-4 font-black uppercase text-xs tracking-tight">{u.name}</td>
                              <td className="p-4 text-xs font-medium opacity-60">{u.email}</td>
                              <td className="p-4">
                                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-primary-color/10 text-primary-color'}`}>
                                    {u.role}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'Reports' && <ReportManager />}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddAdminModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card p-10 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-10 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                   <h2 className="text-4xl font-black uppercase tracking-tighter">Add Admin</h2>
                   <button onClick={() => setShowAddAdminModal(false)} className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"><X size={28}/></button>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Full Name</label>
                      <input 
                        type="text" required placeholder="Admin Name..." className="input-field py-4" 
                        value={newAdmin.name} 
                        onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Email ID</label>
                      <input 
                        type="email" required placeholder="email@example.com" className="input-field py-4" 
                        value={newAdmin.email} 
                        onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Mobile No</label>
                      <input 
                        type="text" required placeholder="+91 ..." className="input-field py-4" 
                        value={newAdmin.phone} 
                        onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Security Password</label>
                      <input 
                        type="password" required placeholder="••••••••" className="input-field py-4" 
                        value={newAdmin.password} 
                        onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                      />
                   </div>
                   
                   <button type="submit" disabled={submitting} className="btn-primary w-full py-6 text-[10px] shadow-2xl mt-4">
                      {submitting ? <Loader2 className="animate-spin mx-auto"/> : 'Grant Admin Authority'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-10 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                   <h2 className="text-4xl font-black uppercase tracking-tighter">{showEditModal ? 'Edit Logistics' : 'New Logistics'}</h2>
                   <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"><X size={28}/></button>
                </div>

                <form onSubmit={showEditModal ? handleEditProduct : handleAddProduct} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Model Nomenclature</label>
                         <input 
                           type="text" required placeholder="Product Title..." className="input-field py-4" 
                           value={showEditModal ? editingProduct.title : newProduct.title} 
                           onChange={e => showEditModal ? setEditingProduct({...editingProduct, title: e.target.value}) : setNewProduct({...newProduct, title: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Pricing Structure (₹)</label>
                         <input 
                           type="number" required placeholder="0.00" className="input-field py-4" 
                           value={showEditModal ? editingProduct.price : newProduct.price} 
                           onChange={e => showEditModal ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Units Available</label>
                         <input 
                           type="number" required placeholder="0" className="input-field py-4" 
                           value={showEditModal ? editingProduct.countInStock : newProduct.countInStock} 
                           onChange={e => showEditModal ? setEditingProduct({...editingProduct, countInStock: e.target.value}) : setNewProduct({...newProduct, countInStock: e.target.value})}
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Category Classification</label>
                      <div className="relative group">
                         <select 
                           className="input-field py-4 appearance-none cursor-pointer pr-12 font-black uppercase text-[10px] tracking-widest transition-all focus:border-primary-color"
                           value={showEditModal ? editingProduct.category : newProduct.category} 
                           onChange={e => showEditModal ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})}
                         >
                            <option value="" disabled className="text-black">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat.name} className="text-black">{cat.name}</option>
                            ))}
                         </select>
                         <ChevronRight className="absolute right-4 top-4 rotate-90 opacity-40 group-hover:text-primary-color group-hover:opacity-100 transition-all" size={20} />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Asset Visualization</label>
                      <div className="flex items-center space-x-8">
                         <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 p-1 group shadow-inner" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                            <img src={showEditModal ? editingProduct.images[0] : newProduct.images} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         <label className="flex-1 cursor-pointer">
                            <div className="w-full py-6 rounded-3xl border-2 border-dashed text-center hover:bg-primary-color/5 hover:border-primary-color transition-all" style={{ borderColor: 'var(--border-color)' }}>
                               {uploading ? <Loader2 className="animate-spin inline mr-2"/> : <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Replace Technical Asset</span>}
                            </div>
                            <input type="file" className="hidden" onChange={(e) => handleUpload(e, showEditModal ? 'edit' : 'new')} accept="image/*" />
                          </label>
                      </div>
                   </div>

                   <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest">Technical Specifications</label>
                      <textarea 
                        required rows="4" placeholder="Describe the battery performance..." className="input-field py-4"
                        value={showEditModal ? editingProduct.description : newProduct.description} 
                        onChange={e => showEditModal ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})}
                      ></textarea>
                   </div>
                   
                   <button type="submit" disabled={submitting} className="btn-primary w-full py-6 text-[10px] shadow-2xl mt-4">
                      {submitting ? <Loader2 className="animate-spin mx-auto"/> : (showEditModal ? 'Commit Technical Changes' : 'Initialize New Product')}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportManager = () => {
  const [stockRange, setStockRange] = useState('day');
  const [loading, setLoading] = useState(false);

  const handleStockReport = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/reports/stock?range=${stockRange}`);
      generateStockReportPDF(data, stockRange);
    } catch (error) {
      alert('Failed to generate stock report');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderReport = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/reports/orders');
      generateOrderSummaryPDF(data);
    } catch (error) {
      alert('Failed to generate order report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="card p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
             <div className="p-3 bg-primary-color/10 rounded-xl text-primary-color" style={{ color: 'var(--primary-color)' }}>
                <Package size={24} />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight">Stock Logistics Report</h3>
          </div>
          <p className="opacity-60 text-xs font-medium leading-relaxed">Download a comprehensive breakdown of units added, sold, and current inventory levels per product nomenclature.</p>
          
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
             <label className="text-[10px] font-black uppercase opacity-40 tracking-widest">Time range Filter</label>
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['day', 'week', 'month', '6month', 'year'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => setStockRange(r)}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${stockRange === r ? 'bg-primary-color text-white' : 'bg-gray-500/5 hover:bg-gray-500/10 opacity-60'}`}
                    style={stockRange === r ? { backgroundColor: 'var(--primary-color)' } : {}}
                  >
                    {r}
                  </button>
                ))}
             </div>
          </div>

          <button 
            disabled={loading}
            onClick={handleStockReport}
            className="btn-primary w-full py-4 flex items-center justify-center space-x-3 text-[10px] tracking-widest"
          >
             <Download size={16} />
             <span>{loading ? 'Generating Assets...' : 'Download Technical Stock Report'}</span>
          </button>
       </div>

       <div className="card p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
             <div className="p-3 bg-primary-color/10 rounded-xl text-primary-color" style={{ color: 'var(--primary-color)' }}>
                <OrdersIcon size={24} />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight">Fulfillment Order Report</h3>
          </div>
          <p className="opacity-60 text-xs font-medium leading-relaxed">Export the complete order directory including customer identification, technical specifications, and transaction history.</p>
          
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
             <button 
               disabled={loading}
               onClick={handleOrderReport}
               className="btn-primary w-full py-4 flex items-center justify-center space-x-3 text-[10px] tracking-widest"
             >
                <Download size={16} />
                <span>{loading ? 'Processing Data...' : 'Download Master Order Directory'}</span>
             </button>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
