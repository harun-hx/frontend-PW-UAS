import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../App.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/login', { 
        email,
        password
      });
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_name', response.data.user.name);
      localStorage.setItem('is_admin', response.data.user.is_admin ? 'true' : 'false');

      navigate('/'); 
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: Please check your email and password.");
    }
  };

  return (
    <div className="app-container">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to access the AI System</p>
        <div className="card">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                className="form-input"
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input"
                type="password" 
                placeholder="••••••••" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{marginTop:'20px'}}>Login</button>
          </form>
        </div>
        <p style={{marginTop:'20px', fontSize:'0.9rem', color:'#666'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--primary)', fontWeight:'bold'}}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;