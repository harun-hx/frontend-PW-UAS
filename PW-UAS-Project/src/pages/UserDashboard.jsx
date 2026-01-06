import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Correctly use the API bridge

function UserDashboard() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchComplaints();
    }
  }, [token, navigate]);

  const fetchComplaints = async () => {
    try {
      // Use the API bridge (automatically handles URL and Token)
      const res = await api.get('/api/complaints');
      setHistory(res.data);
    } catch (error) { 
      console.error("Failed to fetch history:", error); 
    }
  };

  const handleComplain = async (e) => {
    e.preventDefault(); // Stop page reload
    try {
      // Post to correct endpoint
      await api.post('/api/complaints', { subject, message });
      
      alert("Feedback Sent!");
      setSubject('');
      setMessage('');
      
      // Refresh list immediately
      fetchComplaints();
    } catch (error) { 
      console.error(error);
      alert("Failed to send ticket."); 
    }
  };

  return (
    <div className="app-container wide">
      
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">👤 User Support</h1>
        <button onClick={() => navigate('/')} className="btn-back">← Back to Home</button>
      </div>

      <div className="top-grid">
        
        {/* LEFT: Submission Form */}
        <div className="admin-card">
          <div className="card-header-strip bg-create">
            <h3>📝 Submit a Ticket</h3>
          </div>
          <form onSubmit={handleComplain} className="form-body">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="e.g. Error in breed detection" 
                required 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className="form-input" 
                placeholder="Describe your issue..." 
                required 
                rows="6"
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            
            <button type="submit" className="btn-predict" style={{borderRadius: '6px'}}>
              Submit Ticket
            </button>
          </form>
        </div>

        {/* RIGHT: History List */}
        <div className="admin-card">
          <div className="card-header-strip bg-inbox">
            <h3>🕒 History</h3>
            <span className="badge-count">{history.length} Tickets</span>
          </div>

          <div className="table-scroll">
            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No previous tickets.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{fontWeight:'bold'}}>{item.subject}</div>
                        <div style={{color:'#666', fontSize:'0.85rem'}}>{item.message.substring(0, 40)}...</div>
                      </td>
                      <td>
                        <span style={{
                          color: item.status === 'resolved' ? '#27ae60' : '#e67e22',
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;