import React, { useContext } from 'react';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const Header = () => {
  const { theme, toggleTheme, role, setRole } = useContext(AppContext);

  return (
    <header className="header">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Overview</h2>
      </div>
      
      <div className="header-actions">
        <select 
          className="form-select" 
          style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem', cursor: 'pointer' }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Role: Viewer</option>
          <option value="admin">Role: Admin</option>
        </select>

        <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '0.4rem' }}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <button className="btn btn-outline" style={{ padding: '0.4rem' }}>
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' 
          }}>
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
