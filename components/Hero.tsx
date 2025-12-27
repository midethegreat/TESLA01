import React from 'react';
import { ArrowUpRight, UserPlus } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  return (
    <section className="relative pt-32 pb-12 md:pb-20 overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-500/10 blur-[120px] -z-10 rounded-full"></div>
      <div className="absolute bottom-0 left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/5 blur-[100px] -z-10 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000 text-center lg:text-left">
            <div className="glass-subtopic mb-2">
              <span className="text-white text-[9px] font-bold tracking-[0.2em] uppercase">Premium Financial Platform</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] tracking-tighter">
              Tesla Investment - The <span className="text-amber-400">Smartest Way</span> To Grow your money.
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Our expert team helps you make smart investment choices, tailored to your goals, for long-term financial growth. Let's build your future together.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
              <button 
                onClick={onRegisterClick}
                className="w-full sm:w-auto gradient-button px-8 py-3.5 rounded-full text-black font-black flex items-center justify-center gap-2 hover:scale-105 transition transform shadow-lg shadow-amber-500/10 text-xs uppercase tracking-wider">
                <UserPlus size={16} />
                Create Account
              </button>
              <button className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/20 px-8 py-3.5 rounded-full text-white font-bold flex items-center justify-center gap-2 transition text-xs uppercase tracking-wider">
                <ArrowUpRight size={16} />
                How it works
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000 mt-8 lg:mt-0 floating-car">
            <div className="relative rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200" 
                alt="Tesla" 
                className="w-full h-[350px] md:h-[500px] object-cover transform group-hover:scale-105 transition duration-[2s]"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-4 md:-left-6 glass-card p-4 md:p-6 rounded-2xl border border-amber-500/10 shadow-2xl max-w-[160px] md:max-w-[200px]">
              <div className="text-amber-400 font-black text-3xl md:text-4xl mb-0.5">4M+</div>
              <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest leading-tight">Global Trusted Community</div>
            </div>
            
            <div className="absolute top-10 -right-6 opacity-60 hidden md:block">
               <img src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" className="w-20" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
