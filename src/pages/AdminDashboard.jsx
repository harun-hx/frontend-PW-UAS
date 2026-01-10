import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import '../App.css'; // Ensure CSS is imported

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('breeds'); // 'breeds' or 'users'
  
  const [breeds, setBreeds] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Form States
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Security Check
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!isAdmin) {
      alert("Unauthorized Access");
      navigate('/');
      return;
    }
    fetchData();
  }, [activeTab]); 

  const fetchData = async () => {
    try {
      if (activeTab === 'breeds') {
        const res = await api.get('/api/breeds');
        setBreeds(res.data);
      } else {
        const res = await api.get('/api/users');
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  // --- CRUD HANDLERS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/${activeTab}/${id}`);
      fetchData(); 
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await api.put(`/api/${activeTab}/${editingId}`, formData);
      } else {
        // Create
        await api.post(`/api/${activeTab}`, formData);
      }
      setFormData({});
      setEditingId(null);
      fetchData();
      alert("Saved successfully!");
    } catch (error) {
      alert("Operation failed. Check if you are Admin.");
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">🛡️ Admin Dashboard</h1>
        <button onClick={() => navigate('/')} className="btn-back">← Back Home</button>
      </div>

      {/* TABS */}
      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'breeds' ? 'active' : ''}`}
          onClick={() => {setActiveTab('breeds'); resetForm();}}
        >
          Manage Breeds
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {setActiveTab('users'); resetForm();}}
        >
          Manage Users
        </button>
      </div>

      <div className="content-grid">
        
        {/* LEFT: FORM CARD */}
        <div className="card">
          <h3>{editingId ? '✏️ Edit Item' : '➕ Create New'}</h3>
          <p style={{marginBottom: '20px', color: '#6b7280'}}>
            {activeTab === 'breeds' ? 'Add a new dog breed info.' : 'Add a new user manually.'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {/* DYNAMIC FIELDS */}
            {activeTab === 'breeds' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Breed Name</label>
                  <input className="form-input" value={formData.breed_name || ''} onChange={e => setFormData({...formData, breed_name: e.target.value})} required placeholder="e.g. Golden Retriever" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Short description..." />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Image Count</label>
                  <input type="number" className="form-input" value={formData.image_count || ''} onChange={e => setFormData({...formData, image_count: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={formData.sample_image_url || ''} onChange={e => setFormData({...formData, sample_image_url: e.target.value})} placeholder="https://..." />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">User Name</label>
                  <input className="form-input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Password {editingId && '(Leave blank to keep)'}</label>
                  <input type="password" className="form-input" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                
                <label className="checkbox-group">
                  <input type="checkbox" checked={formData.is_admin || false} onChange={e => setFormData({...formData, is_admin: e.target.checked})} />
                  <span>Grant Admin Privileges?</span>
                </label>
              </>
            )}

            <div className="btn-row">
              <button type="submit" className={`btn-submit ${editingId ? 'btn-save' : 'btn-create'}`}>
                {editingId ? 'Update Item' : 'Create Item'}
              </button>
              {editingId && (
                <button type="button" className="btn-submit btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: LIST CARD */}
        <div className="card">
          <h3>📋 Existing {activeTab === 'breeds' ? 'Dog Breeds' : 'Users'}</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{activeTab === 'breeds' ? 'Name' : 'User Info'}</th>
                  <th style={{textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'breeds' ? breeds : users).map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      {activeTab === 'breeds' ? (
                        <strong>{item.breed_name}</strong>
                      ) : (
                        <div>
                          <strong>{item.name}</strong>
                          <div style={{fontSize: '0.8rem', color:'#6b7280'}}>{item.email}</div>
                          {(item.is_admin === 1 || item.is_admin === true) && (
                            <span className="badge-admin">Admin</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button className="action-btn btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'breeds' ? breeds : users).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{textAlign:'center', padding:'20px', color:'#999'}}>No data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}