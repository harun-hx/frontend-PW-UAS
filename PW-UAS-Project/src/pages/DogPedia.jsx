import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function DogPedia() {
  const [breeds, setBreeds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Note: ensure we use /api/breeds
    api.get('/api/breeds')
      .then(res => setBreeds(res.data))
      .catch(err => console.error("Error fetching breeds:", err));
  }, []);

  return (
    <div className="app-container wide">
      <div className="page-header">
        <h1 className="page-title">📚 Dog Encyclopedia</h1>
        <button onClick={() => navigate('/')} className="btn-back">← Back Home</button>
      </div>

      <div className="breed-grid">
        {breeds.length === 0 && <p style={{textAlign:'center', width:'100%', color:'#888'}}>Loading breeds...</p>}

        {breeds.map((breed) => (
          <div key={breed.id} className="breed-card">
            <div className="breed-img-box">
              <img 
                src={breed.sample_image_url || 'https://via.placeholder.com/300?text=No+Image'} 
                alt={breed.breed_name} 
                className="breed-img" 
              />
              <div className="photo-badge">{breed.image_count} Photos</div>
            </div>
            <div className="breed-content">
              <h3 className="breed-title">{breed.breed_name}</h3>
              <p className="breed-desc">{breed.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}