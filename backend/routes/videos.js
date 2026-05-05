const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const upload = require('../middleware/upload');
const { uploadStream, destroy } = require('../lib/cloudinary');

// GET /api/videos
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST /api/videos — upload to Cloudinary then save metadata
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file provided' });

    const title = (req.body.title || req.file.originalname).replace(/\.[^.]+$/, '');

    // Upload buffer to Cloudinary
    const result = await uploadStream(req.file.buffer, {
      public_id: `${Date.now()}-${title.replace(/\s+/g, '_')}`,
      eager: [{ width: 320, height: 180, crop: 'fill', format: 'jpg' }],
      eager_async: true,
    });

    const video = await Video.create({
      title,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      cloudinaryId: result.public_id,
      url: result.secure_url,
      duration: result.duration || null,
      thumbnailUrl: result.eager?.[0]?.secure_url || null,
    });

    res.status(201).json(video);
  } catch (err) {
    if (err.message?.includes('Unsupported') || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: err.message || 'File too large (max 500 MB)' });
    }
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// DELETE /api/videos/:id — remove from Cloudinary + DB
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    await destroy(video.cloudinaryId);
    await video.deleteOne();

    res.json({ message: 'Video deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// PATCH /api/videos/:id — update title
router.patch('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const video = await Video.findByIdAndUpdate(req.params.id, { title }, { new: true });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
