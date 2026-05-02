import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { products as mockProducts } from '../utils/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Star, 
  Shield, 
  Truck, 
  RefreshCw, 
  ShoppingCart, 
  Zap, 
  Loader2, 
  MessageSquare,
  ChevronRight,
  User,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const reviewRef = useRef(null);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      const mock = mockProducts.find(p => (p._id || p.id) === id);
      if (mock) setProduct(mock);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    // Check if it's a mock product (IDs like 'm1', 'm2' or simple numbers)
    if (id.startsWith('m') || !isNaN(id)) {
      return alert('This is a sample product. Reviews can only be posted for real products added via the Admin Panel.');
    }

    setSubmitting(true);
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      fetchProduct();
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToReview = () => {
    reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-color" size={48} /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-4">Product Not Found</h2><button onClick={() => navigate('/products')} className="btn-primary px-8">Back to Shop</button></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in" style={{ color: 'var(--text-color)' }}>
      <button 
        onClick={() => navigate(-1)}
        className="mb-10 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 opacity-40 hover:opacity-100 transition-all hover:-translate-x-2"
      >
        <ArrowLeft size={14} />
        <span>Back to catalog</span>
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[40px] overflow-hidden border-2 p-2 shadow-2xl group" 
            style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}
          >
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover rounded-[32px] group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
             {product.images.map((img, i) => (
               <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 p-1 cursor-pointer hover:border-primary-color transition-all" style={{ borderColor: i === 0 ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                  <img src={img} className="w-full h-full object-cover rounded-xl" />
               </div>
             ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="px-3 py-1 bg-primary-color/10 text-primary-color rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary-color)' }}>
              {product.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mt-6 mb-4 leading-tight uppercase tracking-tighter">{product.title}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                  <span className="ml-3 text-[10px] font-black uppercase tracking-widest opacity-40">{product.rating.toFixed(1)} ({product.numReviews} Reviews)</span>
                </div>
                <button onClick={scrollToReview} className="text-[10px] font-black uppercase tracking-widest hover:underline opacity-60">Write a review</button>
            </div>
          </div>

          <div className="text-5xl font-black mb-10 tracking-tighter">₹{product.price.toLocaleString()}</div>
          
          <p className="opacity-60 mb-8 leading-relaxed font-medium text-lg">
            {product.description}
          </p>

          <div className="mb-10">
             <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {product.countInStock > 0 ? `In Stock (${product.countInStock} Units Available)` : 'Out of Stock'}
                </span>
             </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
             {[
               { icon: Shield, label: '5 Years Warranty', color: 'text-green-500' },
               { icon: Truck, label: 'Express Delivery', color: 'text-blue-500' },
               { icon: RefreshCw, label: 'Easy Exchange', color: 'text-orange-500' },
               { icon: Zap, label: 'Expert Install', color: 'text-yellow-500' }
             ].map((feat, i) => (
               <div key={i} className="flex items-center space-x-3 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
                  <feat.icon className={feat.color} size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{feat.label}</span>
               </div>
             ))}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
               <div className={`flex items-center border-2 rounded-2xl p-1 ${product.countInStock === 0 ? 'opacity-20 pointer-events-none' : ''}`} style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center font-black hover:bg-primary-color/10 rounded-xl transition-all">-</button>
                  <span className="w-14 text-center font-black text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} className="w-12 h-12 flex items-center justify-center font-black hover:bg-primary-color/10 rounded-xl transition-all">+</button>
               </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={product.countInStock === 0}
                className="flex-1 bg-primary-color/10 text-primary-color py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 hover:bg-primary-color/20 transition-all border border-primary-color/20 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: 'var(--primary-color)' }}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.countInStock === 0}
                className="flex-1 btn-primary py-5 text-[10px] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-32 pt-20 border-t" style={{ borderColor: 'var(--border-color)' }} ref={reviewRef}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Client Testimonials</h2>
              <p className="opacity-40 font-black uppercase text-[10px] tracking-widest mt-2">Hear from our community of trusted users</p>
           </div>
           {!user && <p className="text-[10px] font-black uppercase tracking-widest opacity-40 border-b-2 pb-1">Sign in to share your experience</p>}
        </div>

        {user && (
          <div className="card p-10 mb-20 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} />
             </div>
             <h4 className="text-xl font-black uppercase mb-8 tracking-tight">Post a Review</h4>
             <form onSubmit={submitReview} className="relative z-10">
               <div className="flex items-center space-x-3 mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mr-4">Your Rating:</span>
                  <div className="flex space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-all hover:scale-125"
                      >
                        <Star 
                          size={28} 
                          className={ (hover || rating) >= i ? 'text-yellow-400' : 'text-gray-300 opacity-30'} 
                          fill={(hover || rating) >= i ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
               </div>
               <div className="mb-8">
                 <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Your Message</label>
                 <textarea 
                   required
                   className="input-field py-4 min-h-[120px]" 
                   placeholder="How has the battery performance been for you?" 
                   value={comment}
                   onChange={e => setComment(e.target.value)}
                 ></textarea>
               </div>
               <button type="submit" disabled={submitting} className="btn-primary px-12 py-5 text-[10px] shadow-xl flex items-center space-x-3">
                  {submitting ? <Loader2 className="animate-spin" /> : <><span>Post Feedback</span> <ChevronRight size={16} /></>}
               </button>
             </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode='popLayout'>
             {product.reviews && product.reviews.length > 0 ? (
               product.reviews.map((rev, i) => (
                 <motion.div 
                   key={rev._id || i} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="card p-8 flex flex-col hover:border-primary-color/30 transition-all group"
                 >
                    <div className="flex items-center space-x-1 mb-6 text-yellow-400">
                      {[...Array(5)].map((_, starI) => (
                        <Star key={starI} size={14} fill={starI < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="opacity-60 mb-8 italic text-sm leading-relaxed font-medium flex-1">"{rev.comment}"</p>
                    <div className="flex items-center space-x-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                       <div className="w-10 h-10 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color font-black text-xs uppercase" style={{ color: 'var(--primary-color)' }}>
                          {rev.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-[10px] uppercase tracking-widest">{rev.name}</div>
                          <div className="text-[8px] font-black uppercase opacity-30 mt-1">{new Date(rev.createdAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="col-span-full py-20 text-center opacity-30 flex flex-col items-center">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">Be the first to leave a review</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
