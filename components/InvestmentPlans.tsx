import React from 'react';
import { MousePointer2, Briefcase, RefreshCw, Clock, Wallet, Ban, Zap } from 'lucide-react';
import { INVESTMENT_PLANS } from '../constants';
import { InvestmentPlan } from '../types';

interface PlanCardProps {
  plan: InvestmentPlan;
  onInvestClick: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onInvestClick }) => (
  <div className={`relative w-full h-full rounded-[1.5rem] overflow-hidden border transition-all duration-500 flex flex-col glass-card ${plan.isHot ? 'border-amber-500/40 bg-[#1e1a14]/95 shadow-amber-500/5' : 'border-white/5 bg-[#14120e]/95'}`}>
    {/* Plan Header with Image Background */}
    <div className="relative h-32 flex items-center px-6 overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800" 
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14120e] via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-black mb-1 tracking-tight uppercase text-white">{plan.name}</h3>
        <div className="flex items-center gap-1.5">
           <span className="bg-amber-500/10 text-amber-400 text-[8px] font-black px-2 py-0.5 rounded border border-amber-500/20 uppercase">{plan.returnLabel}</span>
           {plan.isHot && <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black px-2 py-0.5 rounded border border-orange-500/20 uppercase">HOT</span>}
        </div>
      </div>
      <div className="absolute right-[-10px] top-[-10px] opacity-20">
        <img src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" className="w-24" alt="" />
      </div>
    </div>

    {/* Plan Details */}
    <div className="p-6 space-y-3 flex-grow flex flex-col">
      {[
        { label: 'Investment', val: `$${plan.minInvestment}-$${plan.maxInvestment}`, icon: <MousePointer2 size={12} className="text-amber-500/80" /> },
        { label: 'Capital Back', val: plan.capitalBack ? 'Yes' : 'No', icon: <Briefcase size={12} className="text-amber-500/80" /> },
        { label: 'Return Type', val: plan.returnType, icon: <RefreshCw size={12} className="text-amber-500/80" /> },
        { label: 'Periods', val: `${plan.periods} Times`, icon: <Clock size={12} className="text-amber-500/80" /> },
        { label: 'Profit withdraw', val: plan.withdrawType, icon: <Wallet size={12} className="text-amber-500/80" /> },
        { label: 'Cancel', val: 'In 30 Minutes', icon: <Ban size={12} className="text-amber-500/80" /> },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center text-[10px]">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            {item.icon}
            {item.label}
          </div>
          <div className="text-amber-400 font-bold">{item.val}</div>
        </div>
      ))}

      <div className="pt-4 mt-auto">
        <button 
          onClick={onInvestClick}
          className="w-full py-3 rounded-full gradient-button text-black font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition transform shadow-xl shadow-amber-500/10 active:scale-95">
          <Zap size={12} fill="currentColor" />
          Invest Now
        </button>
        <p className="text-center text-[8px] text-amber-500/40 mt-3 font-bold uppercase tracking-widest">* No Profit Holidays</p>
      </div>
    </div>
  </div>
);

interface InvestmentPlansProps {
  onInvestClick: () => void;
}

const InvestmentPlans: React.FC<InvestmentPlansProps> = ({ onInvestClick }) => {
  return (
    <section id="plans" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="glass-subtopic mb-4">
            <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">Premium Strategies</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black max-w-2xl mx-auto leading-tight uppercase tracking-tight text-white">
            Tailored investment plans specifically crafted for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INVESTMENT_PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} onInvestClick={onInvestClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;
