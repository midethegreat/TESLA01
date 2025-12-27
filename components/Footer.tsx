import React from 'react';
import { Facebook, Instagram, Youtube, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const telegramUrl = "https://t.me/Allyssabroker";

  return (
    <footer id="contact" className="pt-24 pb-12 bg-[#14120e] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner Section (As per Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-32">
           <div className="lg:col-span-7">
              <div className="overflow-hidden shadow-2xl border border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200" 
                  alt="Tesla high speed" 
                  className="w-full h-auto object-cover"
                />
              </div>
           </div>
           <div className="lg:col-span-5 space-y-8 text-left">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-black font-display leading-[1.1] text-white">
                Tesla Investment - Best Place To Grow Your Money
              </h2>
              <p className="text-gray-400 leading-relaxed text-[13px] md:text-sm font-display font-light">
                At Tesla Investment, we specialize in providing secure, intelligent, and profitable cryptocurrency investment solutions. With cutting-edge technology and a high-accuracy trading system, we offer tailored investment plans to meet your financial goals. Join over 4,000,000 users who trust us for a seamless and reliable investing experience.
              </p>
           </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8 col-span-2 md:col-span-1">
             <h4 className="text-white font-black uppercase tracking-widest text-lg">Links</h4>
             <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Account Login</a></li>
              <li><a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-lg">Links</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-400 transition">Schema</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">FAQ</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-lg">Links</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-400 transition">About</a></li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-6 text-gray-500 md:col-span-1">
            <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition"><Youtube size={20} /></a>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><Send size={20} /></a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Copyright @Tesla Investment 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
