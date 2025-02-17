// client/src/components/Login.js
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/twitter';
  };

  return (
    <div style={styles.container}>
      <h2>Login with Twitter</h2>
      <button style={styles.button} onClick={handleLogin}>
        Login with Twitter
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  button: {
    padding: '0.7rem 1.5rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;
