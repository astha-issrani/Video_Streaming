import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Use /stream instead of direct /:id
    axios.get(`http://localhost:5000/api/videos/${id}/stream`)
      .then(r => setVideo(r.data));
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <video controls width="100%" src={video.streamUrl} />
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <small>By {video.uploader?.username} · {video.views} views</small>
    </div>
  );
}