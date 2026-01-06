import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Use the bridge to Railway

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // FIX: Added '/api' prefix and used the 'api' instance
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
    <div className="app-container auth">
      <h1>Create Account</h1>
      <p className="subtitle">Join us to start identifying breeds</p>
      
      <form onSubmit={handleRegister} className="auth-form">
        <div>
          <label>Full Name</label>
          <input 
            type="text" placeholder="John Doe" required 
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email Address</label>
          <input 
            type="email" placeholder="name@example.com" required 
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label>Password</label>
          <input 
            type="password" placeholder="••••••••" required 
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-predict" style={{width:'100%', marginTop:'20px'}}>Sign Up</button>
      </form>
      
      <p style={{marginTop:'20px', fontSize:'0.9rem', color:'#666'}}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;