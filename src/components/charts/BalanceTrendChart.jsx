import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { format, parseISO } from 'date-fns';

export const BalanceTrendChart = () => {
  const { transactions, theme } = useFinance();

  const data = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    
    const dailyMap = new Map();
    sorted.forEach(txn => {
      const dateStr = format(parseISO(txn.date), 'MMM dd');
      currentBalance += txn.amount;
      dailyMap.set(dateStr, currentBalance);
    });

    return Array.from(dailyMap, ([date, balance]) => ({ date, balance }));
  }, [transactions]);

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  return (
    <div className="glass-panel rounded-2xl p-6 col-span-1 lg:col-span-2 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      <h3 className="text-xl font-bold mb-6 text-foreground tracking-tight relative z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Balance Trajectory
      </h3>
      <div className="h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--card-foreground)'
              }}
              formatter={(value) => [`₹${value.toFixed(2)}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#9333ea" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
