import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login'); // Redirect to login page
  };

  const isLoggedIn = localStorage.getItem('userId') !== null;

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      backgroundColor: '#eee' 
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        {isLoggedIn && <Link to="/favorites">Favorites</Link>}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <button onClick={handleLogout}>Log Out</button>}
      </div>
    </nav>
  );
}

export default Navbar;
