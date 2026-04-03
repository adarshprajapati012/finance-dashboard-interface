import React from 'react';
import { motion } from 'framer-motion';

export const SummaryCard = ({ title, amount, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-2xl p-6 flex flex-col gap-4 overflow-hidden relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className={`p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-bold tracking-tight mb-2">{amount}</h3>
        {trend && (
          <p className={`text-sm font-medium flex items-center gap-1.5 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            <span className="p-1 rounded-full bg-current/10 bg-opacity-20 flex items-center justify-center">
              {trend === 'up' ? '↗' : '↘'}
            </span>
            <span>{trendValue}% from last month</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};
