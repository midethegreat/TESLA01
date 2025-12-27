import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Coins, TrendingUp } from 'lucide-react';
import { INVESTMENT_PLANS } from '../constants';

interface CalculatorProps {
  onInvestClick: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onInvestClick }) => {
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTMENT_PLANS[0].id);
  const [amount, setAmount] = useState<number>(500);
  const [profit, setProfit] = useState<number>(0);

  useEffect(() => {
    const plan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId);
    if (plan) {
      const percentageStr = plan.returnLabel.match(/\d+/)?.[0] || "0";
      const percentage = parseFloat(percentageStr);
      const totalProfit = amount * (percentage / 100) * plan.periods;
      setProfit(totalProfit);
    }
  }, [selectedPlanId, amount]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="glass-subtopic mb-6">
          <span className="text-white text-[9px] font-black tracking-[0.3em] uppercase">Profit Estimator</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-display mb-12 tracking-tight uppercase text-white">Earnings Analysis</h2>
        
        <div className="glass-card p-6 md:p-10 rounded-[2rem] border border-white/5 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <label className="block text-[8px] font-black text-amber-500/40 uppercase tracking-widest text-left mb-2 ml-2">Select Strategy</label>
              <select 
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer transition-all text-xs"
              >
                {INVESTMENT_PLANS.map(plan => (
                  <option key={plan.id} value={plan.id} className="bg-[#1a1814]">{plan.name}</option>
                ))}
              </select>
              <div className="absolute right-4 bottom-3.5 pointer-events-none text-amber-500/20">
                <TrendingUp size={16} />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-[8px] font-black text-amber-500/40 uppercase tracking-widest text-left mb-2 ml-2">Investment Amount</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter Amount"
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-white focus:outline-none focus:border-amber-500/30 transition-all font-bold text-sm"
              />
              <div className="absolute right-4 bottom-3.5 text-amber-500/20">
                <Coins size={16} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full bg-amber-500/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left space-y-0.5">
                <span className="text-amber-500/40 uppercase text-[8px] font-black tracking-widest block">Projected Total Profit</span>
                <span className="text-white font-black text-3xl md:text-4xl font-display leading-none tracking-tighter">${profit.toLocaleString()}</span>
              </div>
              <button 
                onClick={onInvestClick}
                className="w-full md:w-auto gradient-button px-8 py-3.5 rounded-full text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-500/5 transition-all hover:scale-105 active:scale-95">
                Begin Investing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
