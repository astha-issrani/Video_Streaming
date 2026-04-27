import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/videos').then(r => setVideos(r.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>All Videos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {videos.map(v => (
          <Link key={v._id} to={`/video/${v._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#111', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff' }}>▶</span>
              </div>
              <div style={{ padding: 12 }}>
                <strong>{v.title}</strong>
                <p style={{ fontSize: 12, color: '#666' }}>{v.uploader?.username} · {v.views} views</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}