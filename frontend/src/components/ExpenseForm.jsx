import { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/expenses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAdd(res.data);
      setFormData({ title: '', amount: '', category: 'Other', date: '' });
    } catch (err) {
      console.error(err);
      alert('Error adding expense');
    }
  };

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1rem' }}>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Amount (₹)</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" />
        </div>
        <div className="input-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-group">
          <label>Date (Optional)</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
