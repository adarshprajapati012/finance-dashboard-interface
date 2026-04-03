import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const CATEGORY_COLORS = {
  'Housing': '#ef4444',
  'Food': '#3b82f6',
  'Transport': '#f59e0b',
  'Entertainment': '#a855f7',
  'Shopping': '#10b981',
  'Utilities': '#ec4899',
  'Other': '#eab308'
};

const FALLBACK_COLOR = '#94a3b8';

export const SpendingBreakdownChart = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ 
        name, 
        value,
        color: CATEGORY_COLORS[name] || FALLBACK_COLOR
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="glass-panel rounded-2xl p-6 col-span-1 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      <h3 className="text-xl font-bold mb-6 text-foreground tracking-tight relative z-10">Expenses Matrix</h3>
      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-muted-foreground relative z-10">
          No expenses recorded
        </div>
      ) : (
        <div className="w-full relative z-10" style={{ minHeight: '320px', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--card-foreground)'
                }}
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Spent']}
              />
              <Legend 
                verticalAlign="bottom" 
                formatter={(value) => <span className="text-foreground text-sm pl-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
