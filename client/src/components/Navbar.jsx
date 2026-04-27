import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '12px 24px',
      background: '#0f0f0f', color: '#fff'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 20, fontWeight: 'bold' }}>
        🎬 PurpleStream
      </Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/upload" style={{ color: '#ccc', textDecoration: 'none' }}>Upload</Link>
            <span style={{ color: '#ccc' }}>Hi, {user.username}</span>
            <button onClick={handleLogout}
              style={{ background: 'none', border: '1px solid #ccc', color: '#ccc', cursor: 'pointer', padding: '4px 12px', borderRadius: 4 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#ccc', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}