import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', pincode: '', detail: '' });

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
    // Auto-fill from profile
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.address?.phone || '',
        city: user.address?.city || '',
        pincode: user.address?.pincode || '',
        detail: user.address?.detail || ''
      });
    }
  }, [user]);


  const handleNext = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const mappedProducts = cart.map(item => ({
        _id: item._id,
        title: item.title || 'Battery',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.images ? item.images[0] : (item.image || '')
      }));

      const orderData = {
        products: mappedProducts,
        totalAmount: Number(cartTotal) || 0,
        address: formData,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Razorpay',
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid'
      };

      if (paymentMethod === 'cod') {
        await API.post('/orders', orderData);
        clearCart();
        setStep(3);
      } else {
        const { data: rpOrder } = await API.post('/payment/order', { amount: cartTotal });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: rpOrder.amount,
          currency: "INR",
          name: "NOTO Battery",
          description: "Battery Purchase",
          order_id: rpOrder.id,
          handler: async (response) => {
            const { data: verifyData } = await API.post('/payment/verify', response);
            if (verifyData.success) {
              await API.post('/orders', {
                ...orderData,
                paymentId: response.razorpay_payment_id
              });
              clearCart();
              setStep(3);
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
            email: user?.email
          },
          theme: { color: "#E2FF31" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };


  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h1 className="text-4xl font-black mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-8">Thank you for your purchase. We've sent a confirmation email to you.</p>
        <button onClick={() => { clearCart(); window.location.href = '/'; }} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black">Checkout</h1>
        <div className="flex items-center space-x-4">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-color text-white' : 'bg-gray-200'}`} style={step >= 1 ? { backgroundColor: 'var(--primary-color)' } : {}}>1</div>
           <div className="w-8 h-px bg-gray-200"></div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-color text-white' : 'bg-gray-200'}`} style={step >= 2 ? { backgroundColor: 'var(--primary-color)' } : {}}>2</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
           {step === 1 ? (
             <form onSubmit={handleNext} className="space-y-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                   <Truck size={20} />
                   <span>Shipping Address</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                   <input 
                     type="text" placeholder="Full Name" className="p-3 rounded-xl border bg-transparent" required 
                     value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                   <input 
                     type="text" placeholder="Phone Number" className="p-3 rounded-xl border bg-transparent" required 
                     value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
                <input 
                   type="text" placeholder="Full Address" className="w-full p-3 rounded-xl border bg-transparent" required 
                   value={formData.detail} onChange={(e) => setFormData({...formData, detail: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                   <input 
                     type="text" placeholder="City" className="p-3 rounded-xl border bg-transparent" required 
                     value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                   />
                   <input 
                     type="text" placeholder="Pincode" className="p-3 rounded-xl border bg-transparent" required 
                     value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                   />
                </div>
                <button type="submit" className="w-full btn-primary py-4">Continue to Payment</button>
             </form>
           ) : (
             <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                   <CreditCard size={20} />
                   <span>Payment Method</span>
                </h2>
                 <div className="space-y-4">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-primary-color bg-primary-color/5' : 'hover:bg-gray-50'}`}>
                       <input 
                         type="radio" name="pay" 
                         checked={paymentMethod === 'razorpay'} 
                         onChange={() => setPaymentMethod('razorpay')}
                         className="w-5 h-5 accent-primary-color" 
                       />
                       <div className="ml-4 flex-1">
                          <div className="font-bold">Online Payment</div>
                          <div className="text-xs text-gray-500">UPI, Cards, Netbanking</div>
                       </div>
                       <ShieldCheck size={24} className="text-blue-500" />
                    </label>
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-color bg-primary-color/5' : 'hover:bg-gray-50'}`}>
                       <input 
                         type="radio" name="pay" 
                         checked={paymentMethod === 'cod'} 
                         onChange={() => setPaymentMethod('cod')}
                         className="w-5 h-5 accent-primary-color" 
                       />
                       <div className="ml-4 flex-1">
                          <div className="font-bold">Cash on Delivery</div>
                          <div className="text-xs text-gray-500">Pay when you receive</div>
                       </div>
                       <Truck size={24} className="text-gray-400" />
                    </label>
                 </div>

                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading}
                  className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  <span>{loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}</span>
                </button>
                <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-gray-400">Back to Shipping</button>
             </div>
           )}

        </div>

        <div className="md:col-span-1">
           <div className="card p-6">
              <h3 className="font-bold mb-4">Summary</h3>
              <div className="space-y-2 text-sm text-gray-500">
                 <div className="flex justify-between">
                    <span>Order Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-500">FREE</span>
                 </div>
              </div>
              <div className="mt-4 pt-4 border-t font-black text-xl" style={{ borderColor: 'var(--border-color)' }}>
                 ₹{cartTotal.toLocaleString()}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
