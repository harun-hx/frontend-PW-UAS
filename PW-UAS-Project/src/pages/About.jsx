import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="app-container">
      <h1>The Team 🏆</h1>
      <p className="subtitle">The minds behind the project.</p>
      
      <div className="info-section">
        <h3>Your Name</h3>
        <p>Lead Developer & AI Engineer. Built the backend integration and model deployment pipeline.</p>
      </div>

      <div className="info-section">
        <h3>[Friend Name 1]</h3>
        <p>Frontend Designer & QA Tester.</p>
      </div>

      <div className="info-section">
        <h3>[Friend Name 2]</h3>
        <p>Dataset Curator & Research.</p>
      </div>
      
      <Link to="/" className="back-btn">← Back to Analyzer</Link>
    </div>
  );
}

export default About;