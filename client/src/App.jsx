import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { products as mockProducts } from './utils/mockData';
import { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Award, Factory, Clock, ChevronRight, Heart, Star } from 'lucide-react';
import API from './services/api';
import heritageImg from './assets/heritage_factory.jpeg';
import batterySpecsImg from './assets/battery_specs.jpeg';
import ecoBatteryImg from './assets/eco_battery.jpeg';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Landing Page Component
const LandingPage = () => {
   const [featuredProducts, setFeaturedProducts] = useState([]);

   useEffect(() => {
      const fetchFeatured = async () => {
         try {
            const { data } = await API.get('/products');
            setFeaturedProducts(data.slice(0, 4));
         } catch (error) {
            setFeaturedProducts(mockProducts.slice(0, 4));
         }
      };
      fetchFeatured();
   }, []);

   return (
      <main className="animate-fade-in">
         <Hero />

         {/* 2nd Section: Featured Batteries */}
         <section className="py-24 max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Featured Batteries</h2>
                  <p className="opacity-60 mt-2 font-bold uppercase text-xs tracking-widest">Our best sellers for E-Rickshaw & Inverters</p>
               </div>
               <Link to="/products" className="font-black text-primary-color hover:underline flex items-center space-x-2" style={{ color: 'var(--primary-color)' }}>
                  <span>View All</span>
                  <ChevronRight size={20} />
               </Link>
            </div>
            <ProductListing limit={4} />
         </section>

         {/* 3rd Section: The NOTO Advantage */}
         <section className="py-32 overflow-hidden border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="max-w-7xl mx-auto px-4">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                  <div className="max-w-2xl">
                     <div className="text-primary-color font-black text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--primary-color)' }}>Why Choose NOTO?</div>
                     <h2 className="text-4xl md:text-6xl font-black leading-tight uppercase tracking-tighter">The Technology behind <br /> <span className="opacity-40">Superior Power</span></h2>
                  </div>
                  <p className="opacity-60 max-w-sm font-medium">Explore advanced battery technology designed for long life, safety, and reliable backup on Indian roads.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { title: 'Prismatic Cells', desc: 'Built with high-density LiFePO4 prismatic cells for maximum safety and performance.', icon: Zap },
                     { title: 'Smart BMS', desc: 'Inbuilt Battery Management System protects against overcharge, short circuit, and overheating.', icon: ShieldCheck },
                     { title: 'Waterproof', desc: 'Safely drive in all weather conditions with our robust waterproof casing design.', icon: Award },
                     { title: '3500+ Cycles', desc: 'Deliver nearly 10 years of battery life with up to 3500+ charge cycles.', icon: Clock },
                     { title: 'Rapid Charge', desc: 'Reduce downtime with high charge acceptance that gets you back on the road faster.', icon: Factory },
                     { title: 'Ludhiana Heritage', desc: 'Engineered and trusted in Ludhiana since 2017 with 100% customer satisfaction.', icon: HeartIcon }
                  ].map((adv, i) => (
                     <div key={i} className="card p-8 group">
                        <div className="w-14 h-14 rounded-2xl bg-primary-color/10 flex items-center justify-center mb-6 group-hover:bg-primary-color group-hover:text-white transition-all" style={{ color: 'var(--primary-color)' }}>
                           <adv.icon size={28} />
                        </div>
                        <h3 className="text-xl font-black mb-3 uppercase tracking-tight">{adv.title}</h3>
                        <p className="opacity-60 text-sm leading-relaxed font-medium">{adv.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Testimonials Section */}
         <section className="py-24" style={{ backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="max-w-7xl mx-auto px-4 text-center">
               <div className="text-primary-color font-black text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--primary-color)' }}>Hear from Our Users</div>
               <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter" style={{ color: 'var(--text-color)' }}>Real Experiences <br/><span className="opacity-40">from Drivers</span></h2>
               <p className="opacity-60 mb-16 font-bold uppercase text-[10px] tracking-widest">Discover how NOTO transforms E-Rickshaw journeys.</p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  {[
                     {
                        name: 'Raju Singh',
                        text: "Switching to NOTO batteries changed my entire driving experience! I'm achieving more mileage and saving time with the quick charging feature.",
                        stars: 5
                     },
                     {
                        name: 'Manoj Kumar',
                        text: "The performance of NOTO batteries has been outstanding. I am impressed with how long they last, helping me maximize my earnings.",
                        stars: 5
                     },
                     {
                        name: 'Vikram Singh',
                        text: "Installation was simple, and the battery has proven reliable in all weather conditions. Definitely worth the investment!",
                        stars: 5
                     }
                  ].map((testi, i) => (
                     <div key={i} className="p-10 rounded-[40px] rounded-br-none border-2 flex flex-col justify-between transition-all hover:border-primary-color group" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)' }}>
                        <div>
                           <div className="flex text-yellow-400 mb-8 space-x-1">
                              {[...Array(testi.stars)].map((_, i) => (
                                 <Star key={i} size={14} fill="currentColor" />
                              ))}
                           </div>
                           <p className="text-lg font-medium leading-relaxed opacity-60 mb-12 italic" style={{ color: 'var(--text-color)' }}>"{testi.text}"</p>
                        </div>
                        <div className="flex items-center space-x-5 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                           <div className="w-12 h-12 rounded-2xl bg-primary-color/10 flex items-center justify-center text-primary-color font-black text-lg group-hover:bg-primary-color group-hover:text-white transition-all" style={{ color: 'var(--primary-color)' }}>
                              {testi.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-black uppercase tracking-tight text-xs" style={{ color: 'var(--text-color)' }}>{testi.name}</div>
                              <div className="text-[8px] font-black uppercase opacity-30 tracking-widest mt-1">Verified Driver</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 4th Section: Heritage */}
         <section className="py-32" style={{ backgroundColor: 'var(--surface-color)' }}>
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
               <div className="relative">
                  <div className="card rounded-[40px] aspect-square">
                     <img src={heritageImg} alt="Factory" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary-color rounded-full flex flex-col items-center justify-center text-white p-6 shadow-2xl animate-pulse" style={{ backgroundColor: 'var(--primary-color)' }}>
                     <div className="text-4xl font-black">7+</div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-center">Years of Excellence</div>
                  </div>
               </div>
               <div>
                  <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase tracking-tighter">Built for <br /> <span className="text-primary-color" style={{ color: 'var(--primary-color)' }}>Excellence</span></h2>
                  <p className="opacity-60 mb-8 text-lg leading-relaxed font-medium">
                     NOTO Batteries are engineered with advanced technology to withstand extreme Indian conditions. Since 2017, we have been dedicated to quality and customer satisfaction in Ludhiana.
                  </p>
                  <div className="grid grid-cols-2 gap-8 mb-10">
                     <div>
                        <div className="text-2xl font-black mb-1">100%</div>
                        <div className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Recyclable</div>
                     </div>
                     <div>
                        <div className="text-2xl font-black mb-1">Zero</div>
                        <div className="text-[10px] font-bold uppercase opacity-40 tracking-widest">Maintenance</div>
                     </div>
                  </div>
                   <Link to="/about" className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl border-2 font-black text-primary-color hover:bg-primary-color hover:text-white transition-all uppercase tracking-widest text-[10px]" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                     <span>Our Heritage</span>
                     <ChevronRight size={16} />
                   </Link>
                </div>
             </div>
          </section>

          {/* New Section 1: Quality and Trust */}
          <section className="py-32 border-t" style={{ borderColor: 'var(--border-color)' }}>
             <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="mb-20">
                   <div className="text-primary-color font-black text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--primary-color)' }}>Our Journey</div>
                   <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">Quality and Trust <br/><span className="opacity-40">at the Core of Our Brand</span></h2>
                   <p className="opacity-60 max-w-2xl mx-auto font-medium">We focus on delivering high-performance, energy-efficient solutions to empower E-Rickshaw drivers.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-20 items-center text-left">
                   <div>
                      <div className="text-primary-color font-black text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--primary-color)' }}>Experience Unmatched Durability</div>
                      <h3 className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter">Long-lasting <br/>& Reliable</h3>
                      <p className="opacity-60 mb-10 text-lg leading-relaxed font-medium">
                         NOTO lithium batteries are engineered for exceptional durability, ensuring consistent performance over time. With their maintenance-free design, you can focus on your E-Rickshaw journeys, knowing your battery is built to withstand the rigors of daily use and provide reliable power when needed most.
                      </p>
                      <Link to="/products" className="inline-flex items-center space-x-10 px-10 py-5 rounded-2xl bg-primary-color text-black font-black hover:scale-105 transition-all uppercase tracking-widest text-xs shadow-2xl" style={{ backgroundColor: 'var(--primary-color)' }}>
                         <span>Shop Now</span>
                      </Link>
                   </div>
                   <div className="card p-4 rounded-[40px] bg-gradient-to-br from-gray-900 to-black border-none shadow-2xl">
                      <img src={batterySpecsImg} alt="Technical Specifications" className="w-full h-auto rounded-[32px]" />
                   </div>
                </div>
             </div>
          </section>

          {/* New Section 2: Rapid Charging */}
          <section className="py-32" style={{ backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
             <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
                <div className="card p-0 rounded-[40px] overflow-hidden border-none shadow-2xl">
                   <img src={ecoBatteryImg} alt="Rapid Charging Technology" className="w-full h-auto" />
                </div>
                <div>
                   <div className="text-primary-color font-black text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--primary-color)' }}>Enjoy Fast Charging Convenience</div>
                   <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Rapid Charging <br/> <span className="opacity-40">Technology</span></h2>
                   <p className="opacity-60 mb-10 text-lg leading-relaxed font-medium">
                      Equipped with cutting-edge rapid charging technology, NOTO batteries significantly reduce downtime. Our advanced lithium batteries recharge faster, ensuring your E-Rickshaw is ready to hit the road in no time, maximizing your operational efficiency and daily earnings.
                   </p>
                   <Link to="/products" className="inline-flex items-center space-x-10 px-10 py-5 rounded-2xl bg-primary-color text-black font-black hover:scale-105 transition-all uppercase tracking-widest text-xs shadow-2xl" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <span>Shop Now</span>
                   </Link>
                </div>
             </div>
          </section>
       </main>
    );
 };

const HeartIcon = ({ size }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

import { useLocation } from 'react-router-dom';

// Scroll to top on route change
const ScrollToTop = () => {
   const { pathname } = useLocation();
   useEffect(() => {
      window.scrollTo(0, 0);
   }, [pathname]);
   return null;
};

const App = () => {
   return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
         <ThemeProvider>
            <AuthProvider>
               <CartProvider>
                  <Router>
                     <ScrollToTop />
                     <div className="min-h-screen transition-colors duration-300 font-sans selection:bg-primary-color selection:text-white pt-[56px]" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
                        <Navbar />
                        <Routes>
                           <Route path="/" element={<LandingPage />} />
                           <Route path="/products" element={<ProductListing />} />
                           <Route path="/products/:id" element={<ProductDetail />} />
                           <Route path="/cart" element={<Cart />} />
                           <Route path="/checkout" element={<Checkout />} />
                           <Route path="/profile" element={<Profile />} />
                           <Route path="/login" element={<Login />} />
                           <Route path="/register" element={<Register />} />
                           <Route path="/about" element={<About />} />
                           <Route path="/contact" element={<Contact />} />
                           <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>

                        <footer className="py-20 border-t mt-20" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
                           <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                              <div className="col-span-1 md:col-span-2">
                                 <div className="flex items-center space-x-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-color)' }}>N</div>
                                    <span className="text-xl font-black uppercase">NOTO BATTERY</span>
                                 </div>
                                 <p className="opacity-60 max-w-sm font-medium">
                                    Leading the charge in Lithium and Tubular technology since 2017. Built for excellence in Ludhiana, trusted across India.
                                 </p>
                                 <div className="mt-4 text-[10px] font-black opacity-40 uppercase tracking-widest">
                                    GST: 03CBUPS8949F1ZV
                                 </div>
                              </div>
                              <div>
                                 <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">Explore</h4>
                                 <ul className="space-y-4 opacity-60 text-sm font-bold">
                                    <li><Link to="/" className="hover:text-primary-color transition-colors uppercase tracking-tight">Home</Link></li>
                                    <li><Link to="/products" className="hover:text-primary-color transition-colors uppercase tracking-tight">Products</Link></li>
                                    <li><Link to="/about" className="hover:text-primary-color transition-colors uppercase tracking-tight">Our Heritage</Link></li>
                                    <li><Link to="/contact" className="hover:text-primary-color transition-colors uppercase tracking-tight">Find a Dealer</Link></li>
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="font-bold mb-6 uppercase text-xs tracking-widest">Official</h4>
                                 <ul className="space-y-4 opacity-60 text-sm font-medium">
                                    <li className="flex items-start space-x-3">
                                       <span>SEC Group, Baba Karam Singh Road, Punjabi Bagh, Ludhiana, 141007</span>
                                    </li>
                                    <li className="font-black text-black dark:text-white" style={{ color: 'var(--text-color)' }}>
                                       <a 
                                         href="https://wa.me/919592881227?text=Hi NOTO Team, I am interested in your batteries and would like to know more." 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="hover:text-primary-color transition-colors"
                                       >
                                         +91 95928-81227
                                       </a>
                                    </li>
                                    <li className="hover:text-primary-color cursor-pointer font-black">
                                       <a href="mailto:notoldh@gmail.com">notoldh@gmail.com</a>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                           <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t text-center text-[10px] font-black opacity-30 uppercase tracking-widest" style={{ borderColor: 'var(--border-color)' }}>
                              © 2026 NOTO Battery Pvt Ltd. | Powering Your Ride
                           </div>
                        </footer>

                        {/* Floating WhatsApp Button */}
                        <a
                           href="https://wa.me/919592881227?text=Hi, I want to inquire about NOTO Batteries"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
                        >
                           <span className="max-w-0 overflow-hidden group-hover:max-xs transition-all duration-500 whitespace-nowrap font-black uppercase text-[10px] pr-0 group-hover:pr-2">Chat with us</span>
                           <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                        </a>
                     </div>
                  </Router>
               </CartProvider>
            </AuthProvider>
         </ThemeProvider>
      </GoogleOAuthProvider>
   );
};

export default App;
