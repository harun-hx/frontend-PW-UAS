import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

export default function DogPedia() {
  const [breeds, setBreeds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/breeds')
      .then(res => setBreeds(res.data))
      .catch(err => console.error("Error fetching breeds:", err));
  }, []);

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Dog Encyclopedia</h1>
          <p style={{color: '#6b7280'}}>Explore our database of dog breeds.</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-back">← Back Home</button>
      </div>
      {breeds.length === 0 ? (
        <div style={{textAlign:'center', padding:'50px', color:'#888'}}>
          <div className="spinner" style={{marginBottom:'20px'}}></div>
          <p>Loading the pack...</p>
        </div>
      ) : (
        <div className="breed-grid">
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
                <p className="breed-desc">
                  {breed.description 
                    ? (breed.description.length > 100 ? breed.description.substring(0, 100) + "..." : breed.description) 
                    : "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}