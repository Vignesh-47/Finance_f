import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, Search, Trash2, Download } from 'lucide-react';
import TransactionModal from './TransactionModal';

const TransactionList = () => {
  const { transactions, role, deleteTransaction } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and Sort logic
  const filteredAndSortedTransactions = transactions
    .filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const exportCSV = () => {
    // Basic CSV generation
    const headers = ['Date', 'Category', 'Type', 'Amount'];
    const rows = filteredAndSortedTransactions.map(t => [
      t.date,
      `"${t.category}"`, // Escape in case of commas
      t.type,
      t.amount
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `findash_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontWeight: 600 }}>Recent Transactions</h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search category..." 
              style={{ paddingLeft: '2.5rem', width: '200px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="form-select" 
            style={{ width: '120px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>

          <button className="btn btn-outline" onClick={exportCSV} title="Export to CSV">
            <Download size={16} /> Export
          </button>
          
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map((t, index) => (
                <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{t.category}</td>
                  <td>
                    <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  {role === 'admin' && (
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default TransactionList;
