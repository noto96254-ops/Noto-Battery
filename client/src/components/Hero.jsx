import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import images from assets
import bg1 from '../assets/hero_bg_1.png';
import bg2 from '../assets/hero_bg_2.png';
import bg3 from '../assets/hero_bg_3.png';
import bg4 from '../assets/hero_bg_4.png';
import bg5 from '../assets/hero_bg_5.png';
import heroCard from '../assets/hero_card.jpeg';

const backgrounds = [bg1, bg2, bg3, bg4, bg5];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
      {/* Clearer Pause-and-Slide Background Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="flex h-full w-full"
          animate={{ x: `-${index * 100}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          {backgrounds.map((bg, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
               <img 
                 src={bg} 
                 alt={`Slide ${i}`} 
                 className="w-full h-full object-cover"
               />
               {/* Much lighter overlay to keep images clear */}
               <div className="absolute inset-0 bg-black/25"></div>
            </div>
          ))}
        </motion.div>
        
        {/* Subtle bottom gradient just for depth, removed the heavy left black side */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content with Text Shadow for readability */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="drop-shadow-2xl"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary-color/30 bg-primary-color/20 text-primary-color font-black text-xs mb-6 uppercase tracking-widest backdrop-blur-sm" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
            <Zap size={14} fill="currentColor" />
            <span>Since 2017 | Built in Ludhiana</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-tighter text-white" style={{ textShadow: '2px 4px 8px rgba(0,0,0,0.5)' }}>
            Power Your Ride <br /> 
            <span style={{ color: 'var(--primary-color)', textShadow: '2px 4px 8px rgba(0,0,0,0.3)' }}>with NOTO</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-lg leading-relaxed font-bold" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.5)' }}>
            Experience unparalleled performance with our advanced lithium batteries for E-Rickshaws. Drive further, charge faster, and enjoy peace of mind.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg shadow-xl">
              <span>Shop Batteries</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="px-8 py-4 rounded-md font-bold border border-white/40 text-white transition-all hover:bg-white/20 backdrop-blur-sm">
              Our Technology
            </Link>
          </div>

          <div className="mt-12 flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Shield className="text-primary-color" style={{ color: 'var(--primary-color)' }} />
              <span className="text-sm font-black uppercase tracking-tighter text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>1+3 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-primary-color" style={{ color: 'var(--primary-color)' }} />
              <span className="text-sm font-black uppercase tracking-tighter text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Fast Charging Tech</span>
            </div>
          </div>
        </motion.div>

        {/* Image Content (Hero Card) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative group border-4 border-white/10">
             <img 
               src={heroCard} 
               alt="NOTO Premium Battery" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
             
             {/* Floating badge over the card */}
             <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <div className="flex items-center justify-between">
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-color mb-1" style={{ color: 'var(--primary-color)' }}>Top Rated</div>
                      <div className="text-white font-black text-xl uppercase tracking-tight">E-Rickshaw Max</div>
                   </div>
                   <div className="w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: 'var(--primary-color)' }}>5★</div>
                </div>
             </div>
          </div>

          {/* Exterior Floating badge */}
          <div className="absolute -bottom-6 -right-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-4 animate-bounce">
             <div className="w-12 h-12 bg-primary-color rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: 'var(--primary-color)' }}>N</div>
             <div>
               <div className="font-black text-sm uppercase">Ludhiana's Best</div>
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Certified Quality</div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
