import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Insights = () => {
  const { transactions, loading } = useContext(AppContext);

  if (loading) return <div className="p-8 text-center">Loading insights...</div>;

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
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1.8rem', marginBottom: '0.5rem' }}>Financial Insights</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Advanced breakdown of your cash flow and categorized spending.</p>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* Bar Chart: Income vs Expense by Category */}
        <div className="col-span-12 glass-card" style={{ gridColumn: 'span 12', padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Income vs Expense by Category</h3>
          <div style={{ flex: 1, width: '100%' }}>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{ fill: 'var(--card-bg)', opacity: 0.4 }} 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem' }} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No transaction data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart: Expense Distribution */}
        <div className="col-span-6 glass-card" style={{ gridColumn: 'span 6', padding: '1.5rem', height: '450px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Expense Distribution</h3>
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70} // Makes it a Donut chart for cleaner look
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expense data available.
              </div>
            )}
          </div>
        </div>
        
        {/* Top Spending Areas List */}
        <div className="col-span-6 glass-card" style={{ gridColumn: 'span 6', padding: '1.5rem', height: '450px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Top Spending Areas</h3>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {pieData.sort((a, b) => b.value - a.value).map((item, i) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>${item.value.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {((item.value / pieData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% of total
                    </div>
                </div>
              </div>
            ))}
            {pieData.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>No expenses to display.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;