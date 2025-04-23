import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchUsers();
  }, []);

 
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'users', editingId), form);
      } else {
        await addDoc(collection(db, 'users'), form);
      }
      setForm({ name: '', phone: '', email: '' });
      setEditingId(null);
     
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };


  const handleDelete = async id => {
    if (window.confirm('Delete this user?')) {
      setLoading(true);
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" required />
        <input name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" required />
        <input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" required />
        <button type="submit" disabled={loading}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      {loading ? <p>Loading...</p> : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <div>
                <strong>{user.name}</strong>
                <p>{user.phone} • {user.email}</p>
              </div>
              <div>
                <button onClick={() => { setForm(user); setEditingId(user.id); }}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
