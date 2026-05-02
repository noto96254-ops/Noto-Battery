import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Heart, Globe, Award, Factory } from 'lucide-react';
import aboutHero from '../assets/logo.jpeg';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHero} 
            alt="NOTO Branding" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-white"
             style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
           >
             Leading the <span className="text-primary-color" style={{ color: 'var(--primary-color)' }}>Charge</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-xl text-gray-300 max-w-2xl mx-auto font-bold uppercase tracking-wide"
             style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
           >
             Since 2017, we’ve been dedicated to quality and customer satisfaction in Ludhiana.
           </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-color text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Years of Excellence', value: '7+' },
              { label: 'Battery Variants', value: '25+' },
              { label: 'Ludhiana Presence', value: '100%' },
              { label: 'Warranty Promise', value: '1+3Y' },
            ].map((stat, i) => (
              <div key={i}>
                 <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* Story Section */}
      <section className="py-32 max-w-7xl mx-auto px-4">
         <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl font-black mb-8 leading-tight uppercase tracking-tighter">Built with Prismatic Cells, <br /> Engineered for Ludhiana.</h2>
               <div className="space-y-6 opacity-60 leading-relaxed font-medium">
                  <p>
                    NOTO Battery was founded in 2017 with a single-minded focus: to empower the heart of Indian transportation. Based in Ludhiana, we have become the trusted choice for E-Rickshaw and Inverter solutions across the region.
                  </p>
                  <p>
                    We specialize in advanced LiFePO4 Lithium technology and Tall Tubular solutions. Our batteries are waterproof, high-pickup, and designed for 2-wheeler, 3-wheeler, and 4-wheeler applications.
                  </p>
                  <p>
                    Every NOTO battery comes with a 1-year guarantee and a 3-year warranty, reinforcing our commitment to reliable power and peace of mind on every journey.
                  </p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1542442828-287217bfb8a1?q=80&w=400" className="rounded-3xl h-64 w-full object-cover border" style={{ borderColor: 'var(--border-color)' }} alt="Solar" />
                  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400" className="rounded-3xl h-48 w-full object-cover border" style={{ borderColor: 'var(--border-color)' }} alt="Industrial" />
               </div>
               <div className="space-y-4 pt-12">
                  <img src="https://images.unsplash.com/photo-1581092921461-7d65507b3c22?q=80&w=400" className="rounded-3xl h-48 w-full object-cover border" style={{ borderColor: 'var(--border-color)' }} alt="Factory" />
                  <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=400" className="rounded-3xl h-64 w-full object-cover border" style={{ borderColor: 'var(--border-color)' }} alt="Clean Energy" />
               </div>
            </div>
         </div>
      </section>

      {/* Values Section */}
      <section className="py-32 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">The NOTO Power Pillars</h2>
               <p className="opacity-60 font-bold uppercase text-xs tracking-widest">What makes us the best choice for your vehicle.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
               {[
                 { title: 'Prismatic Cells', icon: Zap, desc: 'Advanced LiFePO4 cells for superior safety and high cycle life.' },
                 { title: 'Smart BMS', icon: ShieldCheck, desc: 'Inbuilt protection against overcharge, short circuit, and overheating.' },
                 { title: 'Waterproof', icon: Award, desc: 'Constructed with all-weather materials for reliable Indian road usage.' },
                 { title: 'Fast Charging', icon: Factory, desc: 'Rapid charging solutions to maximize your daily operational efficiency.' },
               ].map((v, i) => (
                 <div key={i} className="card p-8 group">
                    <v.icon size={40} className="text-primary-color mb-6 group-hover:scale-110 transition-transform" style={{ color: 'var(--primary-color)' }} />
                    <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{v.title}</h3>
                    <p className="text-xs opacity-60 leading-relaxed font-bold">{v.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
