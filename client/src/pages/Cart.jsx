import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--border-color)' }}>
          <ShoppingBag size={40} className="opacity-20" />
        </div>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Your cart is empty</h1>
        <p className="opacity-60 mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center space-x-3 px-10 py-5 shadow-2xl">
           <span>Start Shopping</span>
           <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Shopping Cart</h1>
        <p className="opacity-60 font-bold uppercase text-[10px] tracking-widest mt-2">{cart.length} items ready for delivery</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode='popLayout'>
            {cart.map((item) => {
              const itemId = item._id || item.id;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={itemId} 
                  className="card flex flex-col sm:flex-row items-center p-6 gap-8 border hover:border-primary-color/30 transition-colors"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary-color mb-1" style={{ color: 'var(--primary-color)' }}>{item.category}</div>
                    <h3 className="font-black text-xl mb-1 uppercase tracking-tight">{item.title}</h3>
                    <div className="text-xl font-black text-primary-color" style={{ color: 'var(--primary-color)' }}>
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center border-2 rounded-2xl p-1 bg-surface-color" style={{ borderColor: 'var(--border-color)' }}>
                      <button 
                        onClick={() => updateQuantity(itemId, item.quantity - 1)} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-primary-color/10 rounded-xl transition-colors text-primary-color"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        <Minus size={16}/>
                      </button>
                      <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(itemId, item.quantity + 1)} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-primary-color/10 rounded-xl transition-colors text-primary-color"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        <Plus size={16}/>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(itemId)}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-8 sticky top-24 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Order Summary</h2>
            <div className="space-y-6 mb-8">
              <div className="flex justify-between font-bold opacity-60 uppercase text-xs tracking-widest">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold uppercase text-xs tracking-widest">
                <span className="opacity-60">Shipping</span>
                <span className="text-green-500">FREE</span>
              </div>
              <div className="pt-6 border-t flex justify-between font-black text-2xl uppercase tracking-tighter" style={{ borderColor: 'var(--border-color)' }}>
                <span>Total</span>
                <span className="text-primary-color" style={{ color: 'var(--primary-color)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <Link to="/checkout" className="w-full btn-primary py-5 text-sm flex items-center justify-center space-x-3 mb-6">
              <span>Checkout Now</span>
              <ArrowRight size={20} />
            </Link>

            <div className="flex items-center justify-center space-x-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
               <ShieldCheck size={12} />
               <span>Secure encrypted payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
