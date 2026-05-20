import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      alert('Video uploaded successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: 24 }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, height: 80 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files[0])}
            required
          />
        </div>
        {progress > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ background: '#eee', borderRadius: 4, height: 8 }}>
              <div style={{ background: '#6c63ff', width: `${progress}%`, height: 8, borderRadius: 4 }} />
            </div>
            <p style={{ fontSize: 12, marginTop: 4 }}>{progress}% uploaded</p>
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          style={{ width: '100%', padding: 10, background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 4, cursor: uploading ? 'not-allowed' : 'pointer' }}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload'}
        </button>
      </form>
    </div>
  );
}