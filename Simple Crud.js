import { useState } from 'react';
import './App.css';

export default function SimpleCRUD() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { 
        id: Date.now(), 
        text: newItem 
      }]);
      setNewItem('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="crud-container">
      <h2>Simple CRUD</h2>
      <div className="input-group">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter item"
        />
        <button onClick={addItem}>Add</button>
      </div>
      
      <ul className="items-list">
        {items.map(item => (
          <li key={item.id}>
            <span>{item.text}</span>
            <button 
              onClick={() => deleteItem(item.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
