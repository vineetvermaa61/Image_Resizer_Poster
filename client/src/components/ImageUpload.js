// client/src/components/ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizes, setSizes] = useState({
    '300x250': { width: 300, height: 250 },
    '728x90': { width: 728, height: 90 },
    '160x600': { width: 160, height: 600 },
    '300x600': { width: 300, height: 600 },
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || '';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSizeChange = (key, dimension, value) => {
    setSizes((prev) => ({
      ...prev,
      [key]: { ...prev[key], [dimension]: parseInt(value) || prev[key][dimension] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select an image file.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('sizes', JSON.stringify(sizes));

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Image</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />
        </div>
        <div style={styles.sizeContainer}>
          <h3>Resize Options (Optional)</h3>
          {Object.keys(sizes).map((key) => (
            <div key={key} style={styles.sizeGroup}>
              <label style={styles.label}>{key}:</label>
              <input
                type="number"
                value={sizes[key].width}
                onChange={(e) => handleSizeChange(key, 'width', e.target.value)}
                style={styles.sizeInput}
              />
              x
              <input
                type="number"
                value={sizes[key].height}
                onChange={(e) => handleSizeChange(key, 'height', e.target.value)}
                style={styles.sizeInput}
              />
            </div>
          ))}
        </div>
        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
  },
  sizeContainer: {
    textAlign: 'left',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  },
  sizeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  sizeInput: {
    width: '70px',
    padding: '0.3rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.7rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    fontWeight: 'bold',
    color: '#28a745',
  },
};

export default ImageUpload;
