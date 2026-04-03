import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PERMISSIONS } from '../../utils/financeHelpers';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TransactionForm = ({ isOpen, onClose, initialData = null }) => {
  const { addTransaction, editTransaction, role } = useFinance();
  const permissions = PERMISSIONS[role] || PERMISSIONS.viewer;
  
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData ? Math.abs(initialData.amount).toString() : '',
    category: initialData?.category || 'Other',
    type: initialData?.type || 'Expense',
  });

  if ((!permissions.canAdd && !initialData) || (!permissions.canEdit && initialData) || !isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const parsedAmount = parseFloat(formData.amount);
    const finalAmount = formData.type === 'Expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    if (initialData) {
      editTransaction(initialData.id, {
        ...initialData,
        description: formData.description,
        amount: finalAmount,
        category: formData.category,
        type: formData.type,
      });
    } else {
      addTransaction({
        id: `t${Date.now()}`,
        date: new Date().toISOString(),
        amount: finalAmount,
        category: formData.category,
        type: formData.type,
        description: formData.description,
      });
    }
    
    setFormData({ description: '', amount: '', category: 'Other', type: 'Expense' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-md rounded-xl border border-border shadow-xl overflow-hidden glass-panel"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">{initialData ? 'Edit Transaction' : 'New Transaction'}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Type</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Category</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Housing">Housing</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Description</label>
              <input 
                type="text" 
                placeholder="e.g., Groceries"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground">₹</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-md font-medium border border-input hover:bg-muted transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
