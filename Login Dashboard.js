import { useState, useEffect } from 'react';
import './App.css';

export default function Dashboard({ user, setUser }) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('items');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="app-container">
      <div className="dashboard">
        <div className="header">
          <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
          <h2>Welcome, {user}!</h2>
        </div>
        
        <div className="add-item">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new item"
          />
          <button onClick={addItem}>Add</button>
        </div>

        <ul>
          {items.map(item => (
            <li key={item.id}>
              <span>{item.text}</span>
              <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
