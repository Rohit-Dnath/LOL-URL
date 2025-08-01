import { createCanvas, loadImage, registerFont } from 'canvas';
import supabase from '../../src/db/supabase';

// Register a default font (you can add custom fonts if needed)
// registerFont('path/to/font.ttf', { family: 'CustomFont' });

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'URL ID is required' });
    }

    // Get URL data from database
    const { data: urlData, error } = await supabase
      .from("urls")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }
    


    // Create canvas for social media preview (1200x630)
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(200 + i * 200, 100 + i * 50, 50 + i * 20, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Main title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOL URL', 600, 150);

    // URL title
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText(urlData.title || 'Shortened URL', 600, 220);

    // Short URL
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    const shortUrl = `${req.headers.host}/${urlData.custom_url || urlData.short_url}`;
    ctx.fillText(shortUrl, 600, 280);

    // Original URL (truncated if too long)
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    const originalUrl = urlData.original_url.length > 50 
      ? urlData.original_url.substring(0, 50) + '...' 
      : urlData.original_url;
    ctx.fillText(originalUrl, 600, 320);

    // Stats or additional info
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Click to visit', 600, 380);

    // Add QR code if available
    if (urlData.qr) {
      try {
        const qrImage = await loadImage(urlData.qr);
        const qrSize = 120;
        const qrX = 1050;
        const qrY = 480;
        
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        
        // Add border around QR code
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
      } catch (error) {
        console.error('Error loading QR code:', error);
        // Continue without QR code
      }
    }

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send the image
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);

  } catch (error) {
    console.error('Error generating social preview:', error);
    res.status(500).json({ error: 'Failed to generate social preview' });
  }
} 