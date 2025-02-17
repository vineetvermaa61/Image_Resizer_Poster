// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>
          Image Resizer & Twitter Poster
        </h1>
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
