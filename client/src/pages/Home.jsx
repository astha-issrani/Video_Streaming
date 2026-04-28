import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function groupByDate(videos) {
  const groups = {};
  videos.forEach(v => {
    const label = formatDateLabel(v.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(v);
  });
  return groups;
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get('https://heroic-smile-production.up.railway.app/api/videos')
      .then(r => {
        setVideos(r.data);
        setFiltered(r.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDateSearch = (e) => {
    const val = e.target.value;
    setSearchDate(val);
    if (!val) {
      setFiltered(videos);
      return;
    }
    const selected = new Date(val).toDateString();
    setFiltered(videos.filter(v => new Date(v.createdAt).toDateString() === selected));
  };

  const grouped = groupByDate(filtered);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0 }}>All Videos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: '#555', fontSize: 14 }}>Search by date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={handleDateSearch}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
          />
          {searchDate && (
            <button
              onClick={() => { setSearchDate(''); setFiltered(videos); }}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 13 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* No results */}
      {Object.keys(grouped).length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', marginTop: 60 }}>
          {searchDate ? 'No videos found for this date.' : 'No videos yet. Upload one!'}
        </p>
      )}

      {/* Grouped Videos */}
      {Object.entries(grouped).map(([dateLabel, vids]) => (
        <div key={dateLabel} style={{ marginBottom: 40 }}>

          {/* Date Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{
              background: dateLabel === 'Today' ? '#6c63ff' : dateLabel === 'Yesterday' ? '#444' : '#888',
              color: '#fff',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 'bold'
            }}>
              {dateLabel}
            </span>
            <div style={{ flex: 1, height: 1, background: '#eee' }} />
            <span style={{ color: '#aaa', fontSize: 12 }}>{vids.length} video{vids.length > 1 ? 's' : ''}</span>
          </div>

          {/* Video Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {vids.map(v => (
              <Link key={v._id} to={`/video/${v._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  border: '1px solid #eee', borderRadius: 10, overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ background: '#111', height: 155, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 36 }}>▶</span>
                  </div>
                  <div style={{ padding: 12 }}>
                    <strong style={{ display: 'block', marginBottom: 4, fontSize: 15 }}>{v.title}</strong>
                    <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                      {v.uploader?.username} · {v.views} views · {new Date(v.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}