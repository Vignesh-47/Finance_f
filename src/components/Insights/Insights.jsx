import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Insights = () => {
  const { transactions, loading } = useContext(AppContext);

  if (loading) return <div>Loading insights...</div>;

  // 1. Prepare data for Income vs Expense by Category
  const categoryStats = transactions.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { name: curr.category, income: 0, expense: 0 };
    }
    if (curr.type === 'income') {
      acc[curr.category].income += curr.amount;
    } else {
      acc[curr.category].expense += curr.amount;
    }
    return acc;
  }, {});

  const barData = Object.values(categoryStats).sort((a, b) => (b.income + b.expense) - (a.income + a.expense));

  // 2. Prepare data for the Advanced Pie Chart (Only Expenses)
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

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Financial Insights</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Advanced breakdown of your cash flow and categorized spending.</p>
      </div>

      <div className="dashboard-grid">
        {/* Bar Chart: Income vs Expense by Category */}
        <div className="col-span-12 glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Income vs Expense by Category</h3>
          <div style={{ flex: 1 }}>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip cursor={{ fill: 'var(--card-bg)' }} contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No transaction data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Advanced Pie Chart */}
        <div className="col-span-6 glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Expense Distribution</h3>
          <div style={{ flex: 1 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expense data available.
              </div>
            )}
          </div>
        </div>
        
        {/* Simple Summary Widget next to pie chart */}
        <div className="col-span-6 glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
             <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Top Spending Areas</h3>
             <div style={{ flex: 1, overflowY: 'auto' }}>
                 {pieData.sort((a,b) => b.value - a.value).map((item, i) => (
                     <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                         </div>
                         <strong style={{ color: 'var(--text-primary)' }}>${item.value.toLocaleString()}</strong>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
