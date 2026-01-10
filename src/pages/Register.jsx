import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Use the bridge to Railway
import '../App.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/register', {
        name,
        email,
        password
      });

      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_name', response.data.user.name);
      localStorage.setItem('is_admin', 'false');

      alert("Account Created!");
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Register Error:", error);
      alert("Registration Failed. Email might be taken.");
    }
  };

  return (
    <div className="app-container">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p className="subtitle">Join us to start identifying breeds</p>
        
        <div className="card">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                className="form-input"
                type="text" placeholder="John Doe" required 
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                className="form-input"
                type="email" placeholder="name@example.com" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input"
                type="password" placeholder="••••••••" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{marginTop:'20px'}}>Sign Up</button>
          </form>
        </div>
        
        <p style={{marginTop:'20px', fontSize:'0.9rem', color:'#666'}}>
          Already have an account? <Link to="/login" style={{color:'var(--primary)', fontWeight:'bold'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;