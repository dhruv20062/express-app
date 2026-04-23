import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(exp => exp.category === filterCategory);

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <header className="dashboard-header">
        <h2>Hello, {user.name}</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-grid">
        <div className="sidebar">
          <div className="glass-panel summary-card">
            <p>Total Expenses</p>
            <div className="summary-amount">₹{totalAmount.toLocaleString()}</div>
          </div>
          <ExpenseForm onAdd={handleAddExpense} />
        </div>

        <div className="main-content glass-panel">
          <div className="filters">
            <h3>Your Expenses</h3>
            <div style={{ marginLeft: 'auto' }}>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="expense-list">
            {filteredExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No expenses found.
              </p>
            ) : (
              filteredExpenses.map(expense => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-info">
                    <h4>{expense.title}</h4>
                    <p>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="expense-amount">
                    ₹{expense.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
