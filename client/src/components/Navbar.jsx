import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, ShoppingCart, User, Search, Menu, LogOut, Home, LayoutDashboard, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearchQuery.trim())}`);
      setNavSearchQuery(''); // Optional: clear after search or keep it
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'py-2 shadow-xl' : 'py-3 shadow-md'}`}
      style={{ 
        backgroundColor: 'var(--surface-color)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--primary-color)' }}>N</div>
          <span className="text-xl font-black tracking-tighter uppercase">NOTO <span style={{ color: 'var(--primary-color)' }}>BATTERY</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-color transition-all group-hover:w-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
            </Link>
          ))}
        </div>

        {/* Search Bar (Compact) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative group w-48 lg:w-64">
          <input 
            type="text" 
            placeholder="Search..." 
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full border text-[10px] lg:text-xs focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'var(--bg-color)', 
              color: 'var(--text-color)', 
              borderColor: 'var(--border-color)',
              '--tw-ring-color': 'var(--primary-color)'
            }}
          />
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Admin Badge */}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              <LayoutDashboard size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} style={{ color: 'var(--primary-color)' }} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-color text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--primary-color)' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center space-x-2 border-l pl-4" style={{ borderColor: 'var(--border-color)' }}>
              <Link to="/profile" className="flex items-center space-x-2 group">
                 <div className="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--primary-color)' }}>
                    {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="hidden xl:block text-left">
                    <p className="text-[8px] font-black uppercase opacity-40 leading-none">Profile</p>
                    <p className="text-[10px] font-black uppercase tracking-tight truncate w-16">{user.name.split(' ')[0]}</p>
                 </div>
              </Link>
              <button 
                onClick={logout} 
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn-primary text-[10px] px-6 py-2"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-x-0 top-[60px] p-4 flex flex-col space-y-4 animate-slide-down border-b shadow-2xl"
          style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-sm font-black uppercase tracking-widest p-4 rounded-xl hover:bg-primary-color/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
             {user && (
               <button 
                 onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                 className="w-full flex items-center space-x-3 p-4 text-red-500 font-black uppercase tracking-widest text-xs"
               >
                 <LogOut size={18} />
                 <span>Sign Out</span>
               </button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
