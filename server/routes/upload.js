// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

const router = express.Router();

// Configure Multer with memory storage, 5 MB limit, and file type filter
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Only JPEG and PNG are allowed.'));
    }
  },
});

// Predefined sizes (configurable via UI)
const defaultSizes = {
  '300x250': { width: 300, height: 250 },
  '728x90': { width: 728, height: 90 },
  '160x600': { width: 160, height: 600 },
  '300x600': { width: 300, height: 600 },
};

// Middleware to ensure the user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'User not authenticated' });
}
// server/routes/upload.js (update the uploadToImgur function)
async function uploadToImgur(buffer) {
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
  const base64Image = buffer.toString('base64');
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      { image: base64Image, type: 'base64' },
      { 
        headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
        timeout: 30000  // 30 seconds timeout
      }
    );
    if (response.data && response.data.success) {
      return response.data.data.link;
    } else {
      throw new Error('Imgur upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// POST /upload endpoint: Resizes image, uploads to Imgur, and posts a tweet
router.post('/', ensureAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No image file provided");
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log("File received:", req.file.originalname, req.file.mimetype, req.file.size);

    // Use custom sizes if provided; otherwise, default sizes
    let sizes = defaultSizes;
    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch (e) {
        console.warn("Invalid sizes JSON, using default sizes");
      }
    }

    let imgurLinks = {};

    // Resize and upload each version of the image
    for (const [key, { width, height }] of Object.entries(sizes)) {
      console.log(`Resizing image to ${key} (${width}x${height})`);
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(width, height)
        .toFormat('png')
        .toBuffer();
      console.log(`Finished resizing ${key} (buffer length: ${resizedBuffer.length})`);

      console.log(`Uploading ${key} image to Imgur...`);
      const imgurUrl = await uploadToImgur(resizedBuffer);
      imgurLinks[key] = imgurUrl;
      console.log(`Uploaded ${key}: ${imgurUrl}`);
    }

    // Compose tweet text that includes the Imgur URLs
    let tweetText = 'Here are my resized images:\n';
    for (const [key, url] of Object.entries(imgurLinks)) {
      tweetText += `${key}: ${url}\n`;
    }

    // Initialize Twitter client with user tokens
    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: req.user.token,
      accessSecret: req.user.tokenSecret,
    });

    console.log("Posting tweet with text:", tweetText);
    // Use the v2 endpoint to post a text tweet (free tier supports text-only tweets)
    await userClient.v2.tweet(tweetText);

    res.json({ message: 'Image processed and tweet posted successfully!', imgurLinks });
  } catch (error) {
    console.error("Error in /upload route:", error);
    res.status(500).json({ error: error.message || 'An error occurred during processing' });
  }
});

module.exports = router;
