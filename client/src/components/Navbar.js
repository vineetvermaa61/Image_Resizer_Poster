// client/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, [API_URL]);

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <h2 style={styles.brand}>Image Resizer & Poster</h2>
        <div>
          {user ? (
            <>
              <span style={styles.welcome}>Welcome, {user.displayName}</span>
              <button style={styles.navButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button style={styles.navButton}>Login with Twitter</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#343a40',
    padding: '0.5rem 1rem',
    color: '#fff',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    margin: 0,
    fontSize: '1.5rem',
  },
  welcome: {
    marginRight: '1rem',
  },
  navButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Navbar;
