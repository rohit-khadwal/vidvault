const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary as a video.
 * Returns the Cloudinary upload result (public_id, secure_url, duration, etc.)
 */
function uploadStream(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'vidvault', ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

/**
 * Delete a video from Cloudinary by public_id.
 */
function destroy(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}

module.exports = { uploadStream, destroy };
