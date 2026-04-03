import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, PERMISSIONS } from '../../utils/financeHelpers';
import { format, parseISO } from 'date-fns';
import { Trash2, Search, ArrowUpDown, Pencil } from 'lucide-react';

export const TransactionTable = ({ onEdit }) => {
  const { transactions, deleteTransaction, role } = useFinance();
  const permissions = PERMISSIONS[role] || PERMISSIONS.viewer;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(lowerSearch) ||
        t.category.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterType !== 'All') {
      result = result.filter(t => t.type === filterType);
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden col-span-1 lg:col-span-3">
      <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">Recent Transactions</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
            <input 
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border border-border bg-white/5 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border border-border bg-white/5 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All" className="bg-background">All Types</option>
            <option value="Income" className="bg-background">Income</option>
            <option value="Expense" className="bg-background">Expense</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-white/5 uppercase tracking-wider border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => requestSort('date')}>
                <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => requestSort('description')}>
                <div className="flex items-center gap-1">Description <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors text-right" onClick={() => requestSort('amount')}>
                <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              {(permissions.canDelete || permissions.canEdit) && <th className="px-6 py-4 text-center font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={(permissions.canDelete || permissions.canEdit) ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg">No transactions found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((txn) => (
                <tr key={txn.id} className="border-b border-border/30 hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-medium">
                    {format(parseISO(txn.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {txn.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20">
                      {txn.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold tracking-tight ${txn.type === 'Income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {txn.type === 'Income' ? '+' : ''}{formatCurrency(txn.amount)}
                  </td>
                  {(permissions.canDelete || permissions.canEdit) && (
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        {permissions.canEdit && (
                          <button 
                            onClick={() => onEdit(txn)}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg p-2 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {permissions.canDelete && (
                          <button 
                            onClick={() => deleteTransaction(txn.id)}
                            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg p-2 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border/50 p-3 sm:p-4 flex items-center justify-center sm:justify-between bg-white/5">
          <p className="hidden md:block text-xs sm:text-sm text-muted-foreground font-medium ml-2">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary active:bg-primary/20"
            >
              Prev
            </button>
            <div className="flex items-center gap-1 mx-1 sm:mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary text-white shadow-md shadow-primary/25' 
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary active:bg-primary/20"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
