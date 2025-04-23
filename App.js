import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    }
  }, []);

  return (
    <div className="app-container">
      {user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />}
    </div>
  )
}