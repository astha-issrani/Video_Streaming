import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}