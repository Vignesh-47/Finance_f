import React from 'react';
import { LayoutDashboard, PieChart, CreditCard, Settings, Wallet } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <Wallet size={28} />
        <span style={{ fontSize: '1.25rem' }}>Rao Finance Matrix</span>
      </div>
      
      <ul className="nav-menu">
        <li 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </li>
        <li 
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
          style={{ cursor: 'pointer' }}
        >
          <CreditCard size={20} />
          <span>Transactions</span>
        </li>
        <li 
          className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
          style={{ cursor: 'pointer' }}
        >
          <PieChart size={20} />
          <span>Insights</span>
        </li>
      </ul>

      <div style={{ marginTop: 'auto' }}>
        <ul className="nav-menu">
          <li 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ cursor: 'pointer' }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
