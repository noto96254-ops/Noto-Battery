import { useState, useEffect, useRef } from 'react';
import { products as mockProducts } from '../utils/mockData';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Loader2, Search, Zap, ChevronDown, Check, X } from 'lucide-react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ProductListing = ({ limit }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories')
        ]);
        setProducts(prodRes.data.length > 0 ? prodRes.data : mockProducts);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearCategories = () => setSelectedCategories([]);
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm) || 
                          p.description?.toLowerCase().includes(searchTerm) ||
                          p.category?.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const displayProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-color" size={48} style={{ color: 'var(--primary-color)' }} />
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 ${limit ? '' : 'py-12'}`}>

      {!limit && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
             <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tighter">Our Products</h1>
             <p className="opacity-60 font-bold uppercase text-[10px] tracking-widest">Choose from our wide range of premium batteries</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Search batteries..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10 pr-4 py-3 text-xs w-full"
                  />
                  <Search className="absolute left-3 top-3.5 opacity-40" size={16} />
              </div>

              {/* Custom Multi-Select Dropdown */}
              <div className="relative w-full md:w-auto" ref={dropdownRef}>
                 <button 
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="w-full md:w-56 px-4 py-3 rounded-2xl border flex items-center justify-between transition-all hover:border-primary-color bg-surface-color"
                   style={{ 
                     backgroundColor: 'var(--surface-color)', 
                     borderColor: isDropdownOpen ? 'var(--primary-color)' : 'var(--border-color)' 
                   }}
                 >
                   <div className="flex items-center space-x-2">
                      <Filter size={14} className="opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {selectedCategories.length === 0 
                          ? 'All Categories' 
                          : `${selectedCategories.length} Selected`}
                      </span>
                   </div>
                   <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                   {isDropdownOpen && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 5, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 top-full mt-2 w-full md:w-64 card z-50 p-2 shadow-2xl"
                     >
                        <div className="p-3 border-b flex justify-between items-center mb-2" style={{ borderColor: 'var(--border-color)' }}>
                           <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Filter By</span>
                           {selectedCategories.length > 0 && (
                             <button onClick={clearCategories} className="text-[9px] font-black uppercase text-red-500 hover:underline">Clear</button>
                           )}
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                           <button 
                             onClick={clearCategories}
                             className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${selectedCategories.length === 0 ? 'bg-primary-color text-white' : 'hover:bg-primary-color/10'}`}
                             style={selectedCategories.length === 0 ? { backgroundColor: 'var(--primary-color)' } : {}}
                           >
                             <span>All Batteries</span>
                             {selectedCategories.length === 0 && <Check size={14} />}
                           </button>

                           {Array.isArray(categories) && categories.map(cat => (
                             <button 
                               key={cat._id || cat.id}
                               onClick={() => toggleCategory(cat.name)}
                               className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${selectedCategories.includes(cat.name) ? 'bg-primary-color/20 text-primary-color' : 'hover:bg-primary-color/5'}`}
                             >
                               <span className="truncate pr-4">{cat.name}</span>
                               <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedCategories.includes(cat.name) ? 'bg-primary-color border-primary-color text-white' : 'border-gray-400'}`} style={selectedCategories.includes(cat.name) ? { backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' } : {}}>
                                  {selectedCategories.includes(cat.name) && <Check size={10} />}
                               </div>
                             </button>
                           ))}
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
          </div>
        </div>
      )}

      {/* Selected Filters Bar */}
      {!limit && selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
           {selectedCategories.map(cat => (
             <div key={cat} className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-color/10 border border-primary-color/20 text-[9px] font-black uppercase tracking-widest text-primary-color animate-scale-in">
                <span>{cat}</span>
                <button onClick={() => toggleCategory(cat)} className="hover:text-red-500 transition-colors">
                   <X size={12} />
                </button>
             </div>
           ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode='popLayout'>
            {Array.isArray(displayProducts) && displayProducts.map(product => (
              <motion.div
                key={product._id || product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center">
          <Zap className="opacity-20 mb-4" size={64} />
          <p className="text-xl opacity-40 font-black uppercase tracking-widest">No batteries found</p>
          <button onClick={() => {setSearchQuery(''); setSelectedCategories([]);}} className="mt-4 text-primary-color font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
