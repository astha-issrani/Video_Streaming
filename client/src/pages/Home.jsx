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
    if (!val) { setFiltered(videos); return; }
    const selected = new Date(val).toDateString();
    setFiltered(videos.filter(v => new Date(v.createdAt).toDateString() === selected));
  };

  const grouped = groupByDate(filtered);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8fc' }}>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '48px 24px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: 38,
          fontWeight: 800,
          margin: '0 0 6px',
          letterSpacing: '-0.5px'
        }}>
          🎬 All Videos
        </h1>
        <p style={{ color: '#a0a8c0', margin: '0 0 28px', fontSize: 15 }}>
          Browse and watch all uploaded content
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 50,
          padding: '10px 20px',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <input
            type="date"
            value={searchDate}
            onChange={handleDateSearch}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              colorScheme: 'dark',
            }}
          />
          {searchDate && (
            <button
              onClick={() => { setSearchDate(''); setFiltered(videos); }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                borderRadius: 20,
                padding: '3px 12px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ marginTop: 16, color: '#a0a8c0', fontSize: 13 }}>
          {filtered.length} video{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎞️</div>
            <p style={{ color: '#999', fontSize: 16 }}>
              {searchDate ? 'No videos found for this date.' : 'No videos yet. Upload one!'}
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([dateLabel, vids]) => (
          <div key={dateLabel} style={{ marginBottom: 48 }}>

            {/* Date Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{
                background: dateLabel === 'Today'
                  ? 'linear-gradient(135deg, #6c63ff, #a855f7)'
                  : dateLabel === 'Yesterday'
                  ? 'linear-gradient(135deg, #444, #666)'
                  : 'linear-gradient(135deg, #888, #aaa)',
                color: '#fff',
                padding: '5px 18px',
                borderRadius: 25,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: dateLabel === 'Today' ? '0 4px 15px rgba(108,99,255,0.4)' : 'none',
              }}>
                {dateLabel}
              </div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #e0e0f0, transparent)' }} />
              <span style={{
                color: '#aaa', fontSize: 12,
                background: '#fff',
                padding: '3px 10px',
                borderRadius: 20,
                border: '1px solid #eee'
              }}>
                {vids.length} video{vids.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Video Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 22
            }}>
              {vids.map(v => (
                <Link key={v._id} to={`/video/${v._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(108,99,255,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                      height: 160,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: 48, height: 48,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <span style={{ color: '#fff', fontSize: 20, marginLeft: 3 }}>▶</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '14px 16px' }}>
                      <strong style={{
                        display: 'block',
                        fontSize: 15,
                        marginBottom: 6,
                        color: '#1a1a2e',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {v.title}
                      </strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#888' }}>
                          👤 {v.uploader?.username}
                        </span>
                        <span style={{ fontSize: 12, color: '#888' }}>
                          👁 {v.views} · 🕐 {new Date(v.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}