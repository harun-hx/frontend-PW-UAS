import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

function AdminDashboard() {
  const [datasets, setDatasets] = useState([]);
  const [complaints, setComplaints] = useState([]); 
  
  // === CONSTANTS ===
  const REAL_HORSE_PHOTO = "https://images.unsplash.com/photo-1553284965-8367dfd56633?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";

  // === STATE ===
  const [form, setForm] = useState({ breed_name: '', description: '', image_count: '', sample_image_url: '' });
  const [isEditing, setIsEditing] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  // === EFFECTS ===
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/');
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dataRes, compRes] = await Promise.all([
        api.get('/api/datasets'),
        api.get('/api/complaints')
      ]);
      setDatasets(dataRes.data);
      setComplaints(compRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // === HANDLERS ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...form };
      if (!formData.sample_image_url) formData.sample_image_url = REAL_HORSE_PHOTO;

      if (isEditing) {
        await api.put(`/api/datasets/${isEditing}`, formData);
        alert("Updated Successfully!");
      } else {
        await api.post('/api/datasets', formData);
        alert("Created Successfully!");
      }
      resetForm();
      fetchData();
    } catch (error) { 
      console.error(error);
      alert("Operation Failed"); 
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this breed?")) return;
    try {
        await api.delete(`/api/datasets/${id}`);
        fetchData();
    } catch (error) {
        alert("Delete Failed");
    }
  };

  const markResolved = async (id) => {
    try {
      await api.put(`/api/complaints/${id}`);
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
    } catch (error) { alert("Failed to update status"); }
  };

  const handleEditClick = (item) => {
    setForm(item);
    setIsEditing(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setForm({ breed_name: '', description: '', image_count: '', sample_image_url: '' });
    setIsEditing(null);
  };

  const handleImageError = (ev) => {
    ev.target.src = REAL_HORSE_PHOTO;
    ev.target.onerror = null;
  };

  return (
    <div className="app-container wide">
      
      {/* 1. Header Section */}
      <div className="page-header">
        <h1 className="page-title">🐴 Admin Dashboard</h1>
        <button onClick={() => navigate('/')} className="btn-back">← Back to Home</button>
      </div>

      {/* 2. Top Section: Forms & Complaints (Side by Side) */}
      <div className="top-grid">
        
        {/* LEFT: Editor Form */}
        <div className="admin-card">
          <div className={`card-header-strip ${isEditing ? 'bg-edit' : 'bg-create'}`}>
            <h3>{isEditing ? '✏️ Edit Breed Details' : '✨ Add New Breed'}</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-group">
              <label className="form-label">Breed Name</label>
              <input className="form-input" placeholder="e.g. Arabian" value={form.breed_name} onChange={e => setForm({...form, breed_name: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Brief history and traits..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>

            {/* SYMMETRIC COLUMNS FIX: 1fr 1fr for exact 50/50 split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Img Count</label>
                <input type="number" className="form-input" placeholder="100" value={form.image_count} onChange={e => setForm({...form, image_count: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" className="form-input" placeholder="https://..." value={form.sample_image_url || ''} onChange={e => setForm({...form, sample_image_url: e.target.value})} />
              </div>
            </div>

            <div className="btn-row">
              <button type="submit" className={`btn-submit ${isEditing ? 'btn-save' : 'btn-create'}`}>
                {isEditing ? 'Save Changes' : 'Create Breed'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="btn-submit btn-cancel">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: Complaints Inbox */}
        <div className="admin-card">
          <div className="card-header-strip bg-inbox">
            <h3>📩 Inbox</h3>
            <span className="badge-count">
              {complaints.filter(c => c.status === 'pending').length} Pending
            </span>
          </div>
          
          <div className="table-scroll">
            {complaints.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No messages.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td>{c.user?.name || 'ID: ' + c.user_id}</td>
                      <td>
                        <div style={{fontWeight:'bold', marginBottom:'2px'}}>{c.subject}</div>
                        <div style={{color:'#666'}}>{c.message.substring(0, 50)}...</div>
                      </td>
                      <td>
                        {c.status === 'pending' ? (
                          <button onClick={() => markResolved(c.id)} className="btn-resolve">Resolve</button>
                        ) : <span className="status-done">✓ Done</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: The Encyclopedia Grid */}
      <h2 className="section-title">📚 Encyclopedia Database</h2>
      
      <div className="breed-grid">
        {datasets.map(item => (
          <div key={item.id} className="breed-card">
            {/* LARGE IMAGE HEADER */}
            <div className="breed-img-box">
              <img 
                src={item.sample_image_url || REAL_HORSE_PHOTO} 
                onError={handleImageError} 
                alt={item.breed_name}
                className="breed-img"
              />
              <div className="photo-badge">{item.image_count} Photos</div>
            </div>

            {/* CARD BODY */}
            <div className="breed-content">
              <h3 className="breed-title">{item.breed_name}</h3>
              <p className="breed-desc">
                {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
              </p>
              
              {/* ACTION FOOTER */}
              <div className="breed-actions">
                <button onClick={() => handleEditClick(item)} className="action-btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="action-btn btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;