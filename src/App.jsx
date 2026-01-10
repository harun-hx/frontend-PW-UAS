import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Import Pages ---
import Login from './pages/Login';
import Register from './pages/Register';
import DogPedia from './pages/DogPedia';
import AdminDashboard from './pages/AdminDashboard'; 

import './App.css';

// ⚠️ REPLACE THIS WITH YOUR ACTUAL PYTHON RAILWAY URL
const FLASK_API_URL = "https://web-production-81c3.up.railway.app/predict";

// ==========================================
//  HELPER: Clean up the messy breed names
// ==========================================
const formatLabel = (label) => {
  if (!label) return "";
  let cleaned = label.replace(/^\d+-/, ""); 
  cleaned = cleaned.replace(/^n\d+-/, "");
  cleaned = cleaned.replace(/_/g, " ");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// ==========================================
//  HOME COMPONENT
// ==========================================
function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Auth Check
  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);
  
  if (!token) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  // --- 1. Handle File Selection ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setPredictions([]);
      setError(null);

      // 2. Resize and Convert to Base64 (Logic Preserved)
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const base64String = canvas.toDataURL('image/jpeg', 0.7); 
          setSelectedFile(base64String); 
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 2. Convert to Base64 & Send ---
  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setPredictions([]);

    try {
      let base64ToSend = selectedFile;

      if (typeof selectedFile !== 'string') {
         base64ToSend = await new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.readAsDataURL(selectedFile);
           reader.onload = () => resolve(reader.result);
           reader.onerror = (error) => reject(error);
         });
      }

      const response = await axios.post(FLASK_API_URL, {
        image: base64ToSend
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 'success') {
        setPredictions(response.data.predictions);
      } else {
        setError("Prediction failed. " + (response.data.error || ""));
      }

    } catch (err) {
      console.error("Predict Error:", err);
      const msg = err.response?.data?.error || err.message;
      setError(`Failed to process: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* --- Header / Nav --- */}
      <header className="app-header">
        <div className="logo">🐶 DogBreed<span>AI</span></div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/dogs" className="nav-link">DogPedia</Link>
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
      </header>

      {/* --- Main Content --- */}
      <main>
        
        {/* Top Hero Section */}
        <div className="hero-section">
          <h1>Identify Your Dog</h1>
          <p>Upload a photo and let our AI tell you the breed instantly.</p>
        </div>

        <div className="content-grid">
          {/* LEFT: Upload Box - Wrapped in .card */}
          <div className="card upload-column">
              <div className="upload-area">
                <input 
                  type="file" 
                  id="file-upload" 
                  style={{display:'none'}} 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                
                {preview ? (
                  <div>
                    <img src={preview} alt="Dog Preview" className="image-preview" />
                    <label htmlFor="file-upload" className="btn-back" style={{display:'inline-block', textAlign:'center', marginTop: '10px'}}>
                      🔄 Change Photo
                    </label>
                  </div>
                ) : (
                  <label htmlFor="file-upload" className="file-upload-label">
                    <div className="icon">📸</div>
                    <span>Click to Upload Image</span>
                  </label>
                )}

                {/* Predict Button */}
                {preview && (
                  <button 
                    onClick={handlePredict} 
                    className="btn-primary" 
                    style={{marginTop:'20px'}}
                    disabled={loading}
                  >
                    {loading ? <div className="spinner"></div> : "🔍 Analyze Breed"}
                  </button>
                )}
                
                {error && <div style={{color:'red', marginTop:'15px'}}>{error}</div>}
              </div>
          </div>

          {/* RIGHT: Results Section - Wrapped in .card */}
          <div className="card results-column">
            <h3>Top Matches</h3>
            {predictions.length > 0 ? (
              <div className="results-list">
                {/* SLICE TO TOP 5 ONLY - Logic Preserved */}
                {predictions.slice(0, 5).map((pred, index) => {
                  const isWinner = index === 0;
                  return (
                    <div 
                      key={index} 
                      className={`result-card ${isWinner ? 'winner-card' : ''}`}
                    >
                      <div className="result-header">
                        <span className="breed-name">
                          {isWinner && "🏆 "}
                          {formatLabel(pred.label)}
                        </span>
                        <span className="confidence-pill">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${pred.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Placeholder when no results yet
              <div className="empty-state">
                <div className="empty-icon">🐕</div>
                <p>Upload an image to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
//  MAIN ROUTER
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dogs" element={<DogPedia />} /> 
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;