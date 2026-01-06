import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import your configured API

function HorsePedia() {
  const [datasets, setDatasets] = useState([]);
  const navigate = useNavigate();

  const REAL_HORSE_PHOTO = "https://images.unsplash.com/photo-1553284965-8367dfd56633?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";

  useEffect(() => {
    // Fetch from Railway API
    api.get('/api/datasets')
      .then(res => setDatasets(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleImageError = (ev) => {
    ev.target.src = REAL_HORSE_PHOTO;
    ev.target.onerror = null;
  };

  return (
    <div className="app-container wide">
      
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🐴 Horse Encyclopedia</h1>
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
      </div>

      <p className="subtitle" style={{marginBottom:'40px', color: '#666'}}>
        Explore the breeds our AI is trained to recognize. Click to learn more.
      </p>

      {/* The Beautiful Grid */}
      <div className="breed-grid">
        {datasets.length === 0 && <p style={{textAlign:'center', width:'100%'}}>Loading breeds...</p>}
        
        {datasets.map(horse => (
          <div key={horse.id} className="breed-card">
            
            {/* Image Header */}
            <div className="breed-img-box">
              <img 
                src={horse.sample_image_url || REAL_HORSE_PHOTO} 
                alt={horse.breed_name} 
                className="breed-img"
                onError={handleImageError}
              />
              <div className="photo-badge">{horse.image_count} Photos</div>
            </div>

            {/* Content Body */}
            <div className="breed-content">
              <h2 className="breed-title">{horse.breed_name}</h2>
              <p className="breed-desc">
                {horse.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default HorsePedia;