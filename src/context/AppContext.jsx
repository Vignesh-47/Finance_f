import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('viewer'); // viewer or admin
  
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('findash_theme') || 'light';
  });
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('findash_theme', theme);
  }, [theme]);

  // Sync transactions to localStorage whenever they change, but only if they are loaded
  useEffect(() => {
    if (!loading && transactions.length > 0) {
      localStorage.setItem('findash_transactions', JSON.stringify(transactions));
    } else if (!loading && transactions.length === 0) {
      // If user deletes all transactions, we still want to persist the empty state
      localStorage.setItem('findash_transactions', JSON.stringify([]));
    }
  }, [transactions, loading]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const mockData = [
          { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income' },
          { id: '2', date: '2026-04-02', amount: 150, category: 'Food', type: 'expense' },
          { id: '3', date: '2026-04-02', amount: 50, category: 'Transport', type: 'expense' },
          { id: '4', date: '2026-04-03', amount: 200, category: 'Entertainment', type: 'expense' }
        ];
        
        let data = mockData;
        try {
          const res = await fetch('https://finance-b.vercel.app/api/transactions');
          if (res.ok) {
            data = await res.json();
          } else {
            throw new Error('API not ok');
          }
        } catch (e) {
          console.warn("Backend not reachable. Trying LocalStorage.");
          const localData = localStorage.getItem('findash_transactions');
          if (localData) {
            try {
              data = JSON.parse(localData);
              console.log("Loaded transactions from LocalStorage.");
            } catch (err) {
              console.error("Error parsing LocalStorage data, using default mock data.");
            }
          } else {
            console.log("No LocalStorage data found. Using default mock data.");
          }
        }
        
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      amount: Number(transaction.amount)
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ 
      role, setRole, 
      theme, toggleTheme, 
      transactions, addTransaction, deleteTransaction,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
