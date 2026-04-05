import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TransactionList from '../Transactions/TransactionList';

const Dashboard = () => {
  const { transactions, loading } = useContext(AppContext);

  if (loading) return <div>Loading dashboard...</div>;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Mock data for charts
  const trendData = [
    { name: 'Jan', balance: 2000 },
    { name: 'Feb', balance: 2400 },
    { name: 'Mar', balance: 2200 },
    { name: 'Apr', balance: balance > 0 ? balance : 2800 },
  ];

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + current.amount;
      return acc;
    }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <>
      <div className="dashboard-grid">
        {/* Summary Cards */}
        <div className="col-span-4 glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Balance</span>
            <div className="stat-icon primary"><Wallet size={20} /></div>
          </div>
          <div className="stat-value">${balance.toLocaleString()}</div>
        </div>

        <div className="col-span-4 glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Income</span>
            <div className="stat-icon success"><ArrowUpRight size={20} /></div>
          </div>
          <div className="stat-value">${totalIncome.toLocaleString()}</div>
        </div>

        <div className="col-span-4 glass-card stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Expenses</span>
            <div className="stat-icon danger"><ArrowDownRight size={20} /></div>
          </div>
          <div className="stat-value">${totalExpense.toLocaleString()}</div>
        </div>

        {/* Charts */}
        <div className="col-span-8 glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Balance Analytics</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Spending Breakdown</h3>
          <div style={{ flex: 1 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expense data available.
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            {pieData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="col-span-12 glass-card">
          <TransactionList />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
