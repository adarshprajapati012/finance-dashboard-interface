import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, PERMISSIONS } from '../utils/financeHelpers';
import { Header } from './Header';
import { SummaryCard } from './SummaryCard';
import { BalanceTrendChart } from './charts/BalanceTrendChart';
import { SpendingBreakdownChart } from './charts/SpendingBreakdownChart';
import { TransactionTable } from './transactions/TransactionTable';
import { TransactionForm } from './transactions/TransactionForm';
import { InsightsSection } from './insights/InsightsSection';
import { DollarSign, ArrowDownRight, ArrowUpRight, Plus, FileJson, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Dashboard = () => {
  const { transactions, role } = useFinance();
  const permissions = PERMISSIONS[role] || PERMISSIONS.viewer;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  const handleOpenForm = (txn = null) => {
    setEditingTxn(txn);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingTxn(null), 300);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Description'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(t => {
      const row = [
        t.id,
        t.date,
        t.type,
        t.category,
        t.amount,
        `"${t.description.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (transactions.length === 0) return;
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'Income') income += t.amount;
      if (t.type === 'Expense') expense += Math.abs(t.amount);
    });

    return {
      balance: income - expense,
      income,
      expense,
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
              Financial Overview
            </h2>
            <p className="text-muted-foreground text-lg">Welcome back to your intelligence hub.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 gap-1">
              <button 
                onClick={handleExportCSV}
                title="Export CSV"
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" /> <span className="hidden sm:inline">CSV</span>
              </button>
              <button 
                onClick={handleExportJSON}
                title="Export JSON"
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
              >
                <FileJson className="w-4 h-4" /> <span className="hidden sm:inline">JSON</span>
              </button>
            </div>

            {permissions.canAdd && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenForm()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Transaction</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard 
              title="Total Balance" 
              amount={formatCurrency(stats.balance)} 
              icon={DollarSign}
              colorClass="text-primary"
              trend="up"
              trendValue="12.5"
            />
            <SummaryCard 
              title="Total Income" 
              amount={formatCurrency(stats.income)} 
              icon={ArrowUpRight}
              colorClass="text-emerald-500"
              trend="up"
              trendValue="8.2"
            />
            <SummaryCard 
              title="Total Expenses" 
              amount={formatCurrency(stats.expense)} 
              icon={ArrowDownRight}
              colorClass="text-rose-500"
              trend="down"
              trendValue="3.1"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <BalanceTrendChart />
            <SpendingBreakdownChart />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <InsightsSection />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 pb-12">
            <TransactionTable onEdit={handleOpenForm} />
          </motion.div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isFormOpen && <TransactionForm isOpen={isFormOpen} onClose={handleCloseForm} initialData={editingTxn} />}
      </AnimatePresence>
    </div>
  );
};
