// Login.js
import { useState } from 'react';
import './App.css';

export default function Login({ setUser }) {
  const validAccounts = {
    admin: '123',
    user: 'password',
    guest: 'guest123',
    test: '123'
  };

  // error
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (validAccounts[username] === password) {
      localStorage.setItem('user', username);
      setUser(username);
      setError(''); 
    } else {
      setError('Invalid username or password'); // error message
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}