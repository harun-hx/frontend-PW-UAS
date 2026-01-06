import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Use the bridge to Railway

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FIX: Added '/api' prefix and used the 'api' instance
      const response = await api.post('/api/login', { 
        email,
        password
      });

      // Save token and user details
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_name', response.data.user.name);
      localStorage.setItem('is_admin', response.data.user.is_admin ? 'true' : 'false');

      // Go to home and refresh to update Navbar
      navigate('/'); 
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: Please check your email and password.");
    }
  };

  return (
    <div className="app-container auth">
      <h1>Welcome Back</h1>
      <p className="subtitle">Login to access the AI System</p>
      
      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-predict" style={{width:'100%', marginTop:'20px'}}>Login</button>
      </form>
      
      <p style={{marginTop:'20px', fontSize:'0.9rem', color:'#666'}}>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;