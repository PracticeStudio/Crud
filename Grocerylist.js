import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  // State management
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: 1,
    isPurchased: false
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const categories = ['Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 'Pantry'];

  // CRUD Operations
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'groceryItems'));
    setItems(querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      await updateDoc(doc(db, 'groceryItems', editingId), formData);
    } else {
      await addDoc(collection(db, 'groceryItems'), formData);
    }

    resetForm();
    fetchItems();
  };

  const startEditing = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      isPurchased: item.isPurchased
    });
    setEditingId(item.id);
    setIsFormVisible(true);
  };

  const togglePurchased = async (id, currentStatus) => {
    await updateDoc(doc(db, 'groceryItems', id), {
      isPurchased: !currentStatus
    });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this item permanently?')) {
      await deleteDoc(doc(db, 'groceryItems', id));
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Produce',
      quantity: 1,
      isPurchased: false
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💜 Grocery List</h1>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="floating-add-btn"
        >
          <FaPlus />
        </button>
      </header>

      {/* Add/Edit Form */}
      {(isFormVisible || editingId) && (
        <div className="form-container slide-in">
          <form onSubmit={handleSubmit} className="item-form">
            <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            
            <div className="form-group">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Item name"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add Item'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grocery List */}
      <div className="grocery-list">
        {categories.map(category => {
          const categoryItems = items
            .filter(item => item.category === category)
            .sort((a, b) => a.name.localeCompare(b.name));
          
          return categoryItems.length > 0 && (
            <div key={category} className="category-section">
              <h2 className="category-title">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                {category}
              </h2>
              <div className="items-grid">
                {categoryItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`item-card ${item.isPurchased ? 'purchased' : ''}`}
                  >
                    <div className="item-main">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => togglePurchased(item.id, item.isPurchased)}
                        className={`action-btn ${item.isPurchased ? 'purchased-btn' : 'buy-btn'}`}
                      >
                        {item.isPurchased ? <FaCheck /> : <FaCheck />}
                      </button>
                      <button 
                        onClick={() => startEditing(item)}
                        className="action-btn edit-btn"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="action-btn delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function for category icons
function getCategoryIcon(category) {
  const icons = {
    'Produce': '🥦',
    'Dairy': '🥛',
    'Meat': '🍗',
    'Bakery': '🍞',
    'Frozen': '❄️',
    'Pantry': '🫙'
  };
  return icons[category] || '🛒';
}

export default App;
