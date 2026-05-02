import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  if (!product) return null;

  const productPath = `/products/${product._id || product.id}`;
  const price = product.price || 0;
  const rating = product.rating || 0;
  const numReviews = product.numReviews || product.reviews || 0;
  const image = (product.images && product.images.length > 0) ? product.images[0] : '';

  return (
    <div className="card group h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
        <img 
          src={image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Subtle Blur Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-none group-hover:backdrop-blur-sm transition-all duration-500 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
           <Link to={productPath} className="p-3 rounded-full shadow-2xl hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-color)' }}>
             <Eye size={22} />
           </Link>

           <button 
             onClick={() => addToCart(product, 1)}
             className="p-3 text-white rounded-full shadow-2xl hover:scale-110 transition-transform" 
             style={{ backgroundColor: 'var(--primary-color)' }}
           >
             <ShoppingCart size={22} />
           </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-2">
           <Star className="w-4 h-4 text-yellow-400 fill-current" />
           <span className="text-sm font-bold">{rating}</span>
           <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">({numReviews} reviews)</span>
        </div>
        <h3 className="font-black text-lg mb-1 truncate uppercase tracking-tight" title={product.title}>{product.title}</h3>
        <p className="text-xs opacity-60 mb-4 line-clamp-2 font-medium flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
           <span className="text-2xl font-black">₹{price.toLocaleString()}</span>
           <Link to={productPath} className="text-xs font-black uppercase tracking-widest text-primary-color hover:underline" style={{ color: 'var(--primary-color)' }}>
             View Details
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
