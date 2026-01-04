import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import ModelInfo from './pages/ModelInfo';
import './App.css';

// === CHANGE THIS TO YOUR RAILWAY LINK ===
const API_URL = "https://web-production-384d0.up.railway.app/predict";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPredictions([]); // Clear previous results
    }
  };

  const handlePredict = () => {
    if (!selectedFile) return;
    setLoading(true);

    // 1. Create a FileReader to convert image to Base64
    const reader = new FileReader();
    
    // 2. Define what happens when reading finishes
    reader.onloadend = async () => {
      const base64String = reader.result; // This is the data URL

      try {
        // 3. Send to Backend
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        alert("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    // 4. Start reading the file
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="app-container">
      <h1>🐴 Horse Breed AI</h1>
      <p className="subtitle">Upload an image to identify the breed</p>
      
      {/* Navigation */}
      <nav className="navbar">
        <Link to="/model-info" className="nav-link">Model Logic</Link>
        <Link to="/about" className="nav-link">The Team</Link>
      </nav>

      {/* Input Section */}
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*" 
        className="file-input"
      />
      
      {preview && <img src={preview} alt="Preview" className="image-preview" />}

      {/* Action Button or Spinner */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <button 
          onClick={handlePredict} 
          disabled={!selectedFile} 
          className="predict-btn"
        >
          Analyze Breed 🔍
        </button>
      )}

      {/* Results Display */}
      {predictions.length > 0 && (
        <div className="results-list">
          <h3>Analysis Results</h3>
          {predictions.map((pred, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <span>{pred.label}</span>
                {/* Format confidence to % */}
                <span>{(pred.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bg">
                <div 
                  className="progress-fill" 
                  style={{ width: `${pred.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Router Wrapper
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/model-info" element={<ModelInfo />} />
      </Routes>
    </Router>
  );
}

export default App;