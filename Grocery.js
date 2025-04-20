import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';

function App() {
  // State
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    category: 'Produce', 
    quantity: 1,
    purchased: false 
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Categories with icons
  const categories = [
    { name: 'Produce', icon: '🥦' },
    { name: 'Dairy', icon: '🥛' },
    { name: 'Meat', icon: '🍗' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Other', icon: '🛒' }
  ];

  // CRUD Operations
  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, 'groceryItems'));
    setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    if (editingId) {
      await updateDoc(doc(db, 'groceryItems', editingId), newItem);
    } else {
      await addDoc(collection(db, 'groceryItems'), newItem);
    }

    resetForm();
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this item?')) {
      await deleteDoc(doc(db, 'groceryItems', id));
      fetchItems();
    }
  };

  const togglePurchased = async (id, currentStatus) => {
    await updateDoc(doc(db, 'groceryItems', id), {
      purchased: !currentStatus
    });
    fetchItems();
  };

  const resetForm = () => {
    setNewItem({ name: '', category: 'Produce', quantity: 1, purchased: false });
    setEditingId(null);
  };

  // Filter items based on search term
  const filteredCategories = categories.map(category => {
    const categoryItems = items
      .filter(item => 
        item.category === category.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return { ...category, items: categoryItems };
  });

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="app">
      <header>
        <h1>🛒 Grocery List</h1>
      </header>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          placeholder="Add an item..."
          required
        />
        
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
        >
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={newItem.quantity}
          onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
          className="quantity-input"
        />
        
        <button type="submit" className="primary-btn">
          {editingId ? 'Update' : 'Add'}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            onClick={resetForm}
            className="secondary-btn"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Items List */}
      <div className="categories">
        {filteredCategories.map(category => {
          return category.items.length > 0 && (
            <div key={category.name} className="category">
              <h2>
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </h2>
              <ul>
                {category.items.map(item => (
                  <li 
                    key={item.id} 
                    className={item.purchased ? 'purchased' : ''}
                  >
                    <span>
                      {item.name} {item.quantity > 1 && `(${item.quantity})`}
                    </span>
                    <div className="item-actions">
                      <button 
                        onClick={() => togglePurchased(item.id, item.purchased)}
                        className={`status-btn ${item.purchased ? 'purchased' : ''}`}
                      >
                        {item.purchased ? '✓' : '○'}
                      </button>
                      <button 
                        onClick={() => {
                          setNewItem({ 
                            name: item.name, 
                            category: item.category,
                            quantity: item.quantity,
                            purchased: item.purchased
                          });
                          setEditingId(item.id);
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
