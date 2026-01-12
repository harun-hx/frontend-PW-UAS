import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

function About() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">🐶 DogBreed<span>AI</span></div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dogs" className="nav-link">DogPedia</Link>
          <Link to="/about" className="nav-link active">About</Link>
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
      </header>
      <main>
        <div className="hero-section">
          <h1>Under the Hood</h1>
          <p>Transparency about our Machine Learning architecture and performance.</p>
        </div>
        <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <h3>📊 Model Performance & Architecture</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👁️</div>
                <div style={{ fontWeight: '700', color: '#4f46e5' }}>Vision Transformer</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Architecture (ViT)</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>⏱️</div>
                <div style={{ fontWeight: '700', color: '#4f46e5' }}>12h 29m 30s</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Fine-Tuning Time</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎯</div>
                <div style={{ fontWeight: '700', color: '#10b981' }}>98% Accuracy</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Top-5 Prediction</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📚</div>
                <div style={{ fontWeight: '700', color: '#ec4899' }}>Stanford Dogs</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Kaggle Dataset</div>
              </div>
            </div>
            <div style={{ marginTop: '25px', padding: '15px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #d1fae5' }}>
              <p style={{ margin: 0, color: '#065f46' }}>
                <strong>Performance Note:</strong> Our model achieves an impressive <strong>88% accuracy</strong> on the very first prediction (Top-1), rising to <strong>98%</strong> when considering the top 5 likely matches.
              </p>
            </div>
          </div>
          <div className="card">
            <h3>⚙️ How the Processing Works</h3>
            <p style={{ lineHeight: '1.6', color: '#4b5563', marginBottom: '20px' }}>
              We utilize a streamlined pipeline to ensure secure and fast image analysis directly from your browser to our inference engine.
            </p>
            <div className="technical-steps" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div>
                  <strong>Image Capture & Encoding</strong>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Your uploaded image is resized and converted into a Base64 string directly in the browser using HTML5 Canvas.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <div>
                  <strong>JSON Payload Transmission</strong>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    The Base64 string is wrapped in a JSON object and sent securely via POST request to our Flask API.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <div>
                  <strong>ViT Inference</strong>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    The pre-trained Vision Transformer model decodes the image and runs inference against the Stanford Dogs patterns.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;