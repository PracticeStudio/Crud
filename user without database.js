import { useState } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setUsers(users.map(user => 
        user.id === editingId ? { ...form, id: editingId } : user
      ));
    } else {
      setUsers([...users, { ...form, id: Date.now().toString() }]);
    }
    
    setForm({ name: '', phone: '', email: '' });
    setEditingId(null);
  };


  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user.id);
  };

 
  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
          type="email"
        />
        <button type="submit">
          {editingId ? 'Update User' : 'Add User'}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setForm({ name: '', phone: '', email: '' });
          }}>
            Cancel
          </button>
        )}
      </form>

      <div>
        <h2>User List</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <div>
                <strong>{user.name}</strong>
                <p>Phone: {user.phone}</p>
                <p>Email: {user.email}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
