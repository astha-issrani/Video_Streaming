const router = require('express').Router();
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Video = require('../models/Video');
const auth = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: 'us-east-005',
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

// Use memory storage — file goes through your server
const upload = multer({ storage: multer.memoryStorage() });

// Upload video through backend → B2
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file provided' });

    const fileKey = `videos/${uuidv4()}-${file.originalname}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const video = await Video.create({
      title,
      description,
      fileKey,
      size: file.size,
      uploader: req.user._id,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('uploader', 'username')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stream video — signed URL
router.get('/:id/stream', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploader', 'username');

    if (!video) return res.status(404).json({ message: 'Video not found' });

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: video.fileKey,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ ...video.toObject(), streamUrl: signedUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete video
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: video.fileKey
    }));
    await video.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;