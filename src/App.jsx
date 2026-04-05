import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import Insights from './components/Insights/Insights';

function App() {
  const { theme } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <div className="card glass-card"><h2 style={{ marginBottom: '1rem' }}>Settings</h2><p style={{color: 'var(--text-secondary)'}}>Configuration options coming soon...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  // Use lucide icons implicitly via components
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header />
        <div className="page-content animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
