import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
      <div className="text-center mb-20">
         <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Get in Touch</h1>
         <p className="opacity-60 max-w-2xl mx-auto text-lg font-medium">
            Have questions about our batteries or need technical support? We're here to help you stay powered.
         </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
           <div className="card p-8 group">
              <div className="w-12 h-12 bg-primary-color/10 rounded-xl flex items-center justify-center mb-6 text-primary-color group-hover:bg-primary-color group-hover:text-white transition-all" style={{ color: 'var(--primary-color)' }}>
                 <Mail size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase">Email Us</h3>
              <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-4">Official Brand Support</p>
              <a href="mailto:Info@notobattery.com" className="font-black text-primary-color hover:underline" style={{ color: 'var(--primary-color)' }}>Info@notobattery.com</a>
           </div>

           <div className="card p-8 group">
              <div className="w-12 h-12 bg-primary-color/10 rounded-xl flex items-center justify-center mb-6 text-primary-color group-hover:bg-primary-color group-hover:text-white transition-all" style={{ color: 'var(--primary-color)' }}>
                 <Phone size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase">Call Us</h3>
              <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-4">Mon - Sat: 9:00 AM - 7:00 PM</p>
              <a href="tel:+917658039061" className="font-black text-primary-color hover:underline" style={{ color: 'var(--primary-color)' }}>+91 76580 39061</a>
           </div>

           <div className="card p-8 group">
              <div className="w-12 h-12 bg-primary-color/10 rounded-xl flex items-center justify-center mb-6 text-primary-color group-hover:bg-primary-color group-hover:text-white transition-all" style={{ color: 'var(--primary-color)' }}>
                 <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase">Our Factory</h3>
              <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mb-4">Ludhiana, Punjab</p>
              <p className="text-sm font-bold opacity-70 mb-4">SEC Group, Baba Karam Singh Road, Punjabi Bagh, Ludhiana, 141007</p>
              <button className="font-black text-primary-color underline text-xs uppercase" style={{ color: 'var(--primary-color)' }}>View on Maps</button>
           </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
           <form className="card p-8 md:p-12 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Your Name</label>
                    <input type="text" placeholder="Full Name" className="input-field" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Email Address</label>
                    <input type="email" placeholder="email@example.com" className="input-field" />
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Subject</label>
                 <select className="input-field appearance-none">
                    <option className="text-black">Product Inquiry</option>
                    <option className="text-black">Technical Support</option>
                    <option className="text-black">Distributorship</option>
                    <option className="text-black">Other</option>
                 </select>
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Message</label>
                 <textarea rows="6" placeholder="How can we help you?" className="input-field"></textarea>
              </div>
              <button className="btn-primary w-full flex items-center justify-center space-x-3 text-sm py-5 shadow-2xl">
                 <span>Send Message</span>
                 <Send size={18} />
              </button>
           </form>

           <div className="mt-12 p-8 rounded-[2rem] border-2 border-dashed flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: 'var(--primary-color)' }}>
              <div>
                 <h4 className="font-black text-2xl mb-1 uppercase tracking-tight">Instant Chat?</h4>
                 <p className="opacity-60 text-sm font-medium">Message us directly on WhatsApp for a faster response.</p>
              </div>
              <a 
                href="https://wa.me/917658039061" 
                className="bg-green-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center space-x-2 hover:scale-105 transition-transform shadow-xl shadow-green-500/20"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
