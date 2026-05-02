import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, Clock, CheckCircle, Truck, Loader2, MapPin, Hash, ShieldCheck, Download, FileText } from 'lucide-react';
import API from '../services/api';
import { generateInvoicePDF, generateOrderSummaryPDF } from '../utils/pdfGenerator';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Tracking');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    city: '',
    pincode: '',
    detail: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.address?.phone || '',
        city: user.address?.city || '',
        pincode: user.address?.pincode || '',
        detail: user.address?.detail || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (order) => {
    generateInvoicePDF(order);
  };

  const downloadHistory = () => {
    if (orders.length === 0) return alert('No orders to export');
    
    const formattedOrders = orders.map(o => ({
      orderId: o._id,
      customerName: user.name,
      phone: o.address?.phone,
      address: `${o.address?.detail}, ${o.address?.city} - ${o.address?.pincode}`,
      products: o.products.map(p => `${p.title} (x${p.quantity})`).join('; '),
      totalAmount: o.totalAmount,
      status: o.orderStatus,
      date: o.createdAt
    }));
    
    generateOrderSummaryPDF(formattedOrders);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', profileData);
      const updatedUser = { ...user, name: data.name, address: data.address };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--border-color)' }}>
           <ShieldCheck size={40} className="opacity-20" />
        </div>
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Access Denied</h1>
        <p className="opacity-60 mb-8 font-medium">Please login to view your personal dashboard.</p>
        <button onClick={() => window.location.href='/login'} className="btn-primary px-10 py-4">Login Now</button>
      </div>
    );
  }

  const trackingOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
  const historyOrders = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-color" style={{ backgroundColor: 'var(--primary-color)' }}></div>
              <div className="w-20 h-20 bg-primary-color text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                 {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">Verified Member</p>
              
              <div className="mt-6 p-3 rounded-xl border border-dashed flex items-center justify-between text-[10px]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                 <div className="flex items-center space-x-2 opacity-60">
                    <Hash size={12} />
                    <span className="font-black uppercase">User ID</span>
                 </div>
                 <span className="font-mono font-black text-primary-color" style={{ color: 'var(--primary-color)' }}>{user._id.slice(-8).toUpperCase()}</span>
              </div>
           </div>

           <nav className="card overflow-hidden">
              <TabButton active={activeTab === 'Tracking'} onClick={() => setActiveTab('Tracking')} icon={<Truck size={18}/>} label="Order Tracking" count={trackingOrders.length} />
              <TabButton active={activeTab === 'History'} onClick={() => setActiveTab('History')} icon={<Clock size={18}/>} label="Order History" />
              <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} icon={<Settings size={18}/>} label="Settings" />
              
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 p-5 font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <LogOut size={16} />
                <span>Logout Session</span>
              </button>
           </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           {activeTab === 'Tracking' && (
             <OrderList title="Live Tracking" orders={trackingOrders} loading={loading} emptyMsg="No active orders at the moment." />
           )}

           {activeTab === 'History' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Purchase History</h1>
                  <button 
                    onClick={downloadHistory}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-primary-color text-primary-color font-black uppercase text-[10px] tracking-widest hover:bg-primary-color hover:text-white transition-all"
                    style={{ borderColor: 'var(--primary-color)' }}
                  >
                    <Download size={14} />
                    <span>Export History</span>
                  </button>
                </div>
                {loading ? (
                   <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-color" size={40} /></div>
                ) : historyOrders.length === 0 ? (
                   <div className="card p-20 text-center opacity-40 font-black uppercase text-xs tracking-widest border-dashed border-2">Your history is empty.</div>
                ) : (
                   <div className="space-y-4">
                     {historyOrders.map(order => <OrderCard key={order._id} order={order} onDownload={() => downloadInvoice(order)} />)}
                   </div>
                )}
              </div>
           )}

           {activeTab === 'Settings' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Account Settings</h1>
                <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-8">
                   <div className="card p-8 space-y-6">
                      <h3 className="font-black text-lg uppercase tracking-tight flex items-center space-x-2">
                         <User size={20} className="text-primary-color" />
                         <span>Basic Info</span>
                      </h3>
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Full Name</label>
                         <input 
                           type="text" 
                           value={profileData.name} 
                           onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                           className="input-field py-3" 
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Email Address</label>
                         <input type="email" defaultValue={user.email} disabled className="input-field py-3 opacity-40 cursor-not-allowed" style={{ backgroundColor: 'var(--bg-color)' }} />
                      </div>
                   </div>

                   <div className="card p-8 space-y-6">
                      <h3 className="font-black text-lg uppercase tracking-tight flex items-center space-x-2">
                         <MapPin size={20} className="text-primary-color" />
                         <span>Delivery Address</span>
                      </h3>
                      <div>
                         <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Phone Number</label>
                         <input 
                           type="text" 
                           value={profileData.phone} 
                           onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                           placeholder="91XXXXXXXX"
                           className="input-field py-3" 
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">City</label>
                            <input 
                              type="text" 
                              value={profileData.city} 
                              onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                              className="input-field py-3" 
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Pincode</label>
                            <input 
                              type="text" 
                              value={profileData.pincode} 
                              onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                              className="input-field py-3" 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="md:col-span-2 card p-8">
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">Detailed Address</label>
                      <textarea 
                        rows="3"
                        value={profileData.detail} 
                        onChange={(e) => setProfileData({...profileData, detail: e.target.value})}
                        className="input-field"
                        placeholder="Street name, Building, Landmark..."
                      ></textarea>
                      <div className="mt-6 flex justify-end">
                         <button type="submit" disabled={saving} className="btn-primary px-12 py-4">
                            {saving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                         </button>
                      </div>
                   </div>
                </form>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 font-black uppercase text-[10px] tracking-widest transition-all ${active ? 'text-white' : 'opacity-60 hover:opacity-100 hover:bg-primary-color/5'}`}
    style={active ? { backgroundColor: 'var(--primary-color)' } : {}}
  >
    <div className="flex items-center space-x-3">
       {icon}
       <span>{label}</span>
    </div>
    {count > 0 && <span className="px-2 py-0.5 bg-white text-primary-color rounded-full text-[9px] font-black">{count}</span>}
  </button>
);

const OrderList = ({ title, orders, loading, emptyMsg }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">{title}</h1>
    {loading ? (
       <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-color" size={40} /></div>
    ) : orders.length === 0 ? (
       <div className="card p-20 text-center opacity-40 font-black uppercase text-xs tracking-widest border-dashed border-2">{emptyMsg}</div>
    ) : (
       <div className="space-y-4">
         {orders.map(order => <OrderCard key={order._id} order={order} />)}
       </div>
    )}
  </motion.div>
);

const OrderCard = ({ order, onDownload }) => (
  <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all border-l-4 border-l-primary-color" style={{ borderLeftColor: 'var(--primary-color)' }}>
     <div className="flex items-center space-x-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary-color" style={{ color: 'var(--primary-color)', backgroundColor: 'var(--bg-color)' }}>
           <Package size={24} />
        </div>
        <div>
           <div className="flex items-center space-x-3">
              <h4 className="font-black uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h4>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {order.orderStatus}
              </span>
           </div>
           <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">
             {new Date(order.createdAt).toLocaleDateString()} • {order.products.length} Items
           </p>
        </div>
     </div>
     <div className="flex items-center space-x-8">
        <div className="text-right">
           <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Total Amount</p>
           <p className="text-xl font-black text-primary-color" style={{ color: 'var(--primary-color)' }}>₹{order.totalAmount.toLocaleString()}</p>
        </div>
        {onDownload && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="p-3 bg-primary-color/10 rounded-xl text-primary-color hover:bg-primary-color hover:text-white transition-all"
            style={{ color: 'var(--primary-color)' }}
            title="Download Invoice"
          >
             <FileText size={20} />
          </button>
        )}
        <ChevronRight className="opacity-20" size={24} />
     </div>
  </div>
);

export default Profile;
