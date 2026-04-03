import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_TRANSACTIONS } from '../data/mockTransactions';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });
  const [role, setRole] = useState('admin');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addTransaction = (txn) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  const editTransaction = (id, updatedTxn) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, ...updatedTxn } : txn))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    transactions,
    role,
    setRole,
    theme,
    toggleTheme,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
