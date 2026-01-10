import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DogPedia from './pages/DogPedia'; 
import AdminDashboard from './pages/AdminDashboard'; 
// Note: We removed ModelInfo and About to keep it simple, 
// but you can keep them if you have those files.

import './App.css';

// === FLASK AI URL (Your Dog Model) ===
const FLASK_API_URL = "https://web-production-384d0.up.railway.app/predict";

// === HOME COMPONENT ===
function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true'; // Check for string "true"

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);
  
  if (!token) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPredictions([]); 
    }
  };

  const handlePredict = () => {
    if (!selectedFile) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      // Remove header prefix for the raw base64
      const base64String = reader.result; 
      
      try {
        const response = await fetch(FLASK_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });
        
        const data = await response.json();
        
        if (data.predictions) {
          setPredictions(data.predictions);
        } else {
          alert("Error: " + (data.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to AI server.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-container narrow">
      <h1 className="page-title">🐶 Dog Breed AI</h1>
      <p style={{color:'#666', marginBottom:'20px', textAlign:'center'}}>
        Upload an image to identify the breed
      </p>
      
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-link active">Home</Link>
        <Link to="/dogs" className="nav-link">Encyclopedia</Link>
        
        {/* Only Admin sees the Admin Panel */}
        {isAdmin && <Link to="/admin" className="nav-link admin">Admin Panel</Link>}
        
        <button onClick={handleLogout} className="nav-link logout">Logout</button>
      </nav>

      {/* PREDICTION UI */}
      <div className="file-upload-box">
        <input type="file" onChange={handleFileChange} accept="image/*" className="file-input" />
        
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <button onClick={handlePredict} disabled={!selectedFile} className="btn-predict">
            Analyze Breed 🔍
          </button>
        )}
      </div>

      {/* RESULTS */}
      {predictions.length > 0 && (
        <div className="results-section">
          <h3>Analysis Results</h3>
          {predictions.map((pred, index) => {
            let barColor = '#e74c3c'; 
            if (pred.confidence > 0.8) barColor = '#2ecc71'; 
            else if (pred.confidence > 0.5) barColor = '#f1c40f'; 

            return (
              <div key={index} className="result-card">
                <div className="result-info">
                  <span>{pred.label}</span>
                  <span style={{color: barColor}}>{(pred.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${pred.confidence * 100}%`, backgroundColor: barColor }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// === MAIN ROUTER ===
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* New Route for Dogs */}
        <Route path="/dogs" element={<DogPedia />} /> 
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;