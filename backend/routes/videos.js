const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const upload = require('../middleware/upload');

// GET /api/videos — list all videos (newest first)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST /api/videos — upload a video
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const title = req.body.title || req.file.originalname.replace(/\.[^.]+$/, '');

    const video = await Video.create({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(video);
  } catch (err) {
    // Clean up file if DB save fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    if (err.message?.includes('Unsupported') || err.message?.includes('too large')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/videos/:id — get single video metadata
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// GET /api/videos/:id/stream — stream video with range support
router.get('/:id/stream', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const filePath = path.join(__dirname, '../uploads', video.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': video.mimetype,
      });
      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': video.mimetype,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch {
    res.status(500).json({ error: 'Streaming failed' });
  }
});

// DELETE /api/videos/:id — delete video + file
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const filePath = path.join(__dirname, '../uploads', video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// PATCH /api/videos/:id — update title
router.patch('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
