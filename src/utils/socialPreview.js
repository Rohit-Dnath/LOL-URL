// Utility to generate social media preview images for short URLs
export const generateSocialPreviewImage = async (urlData) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size for social media (1200x630 is optimal for most platforms)
  canvas.width = 1200;
  canvas.height = 630;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Add some decorative elements
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
  const shortUrl = `${window.location.origin}/${urlData.custom_url || urlData.short_url}`;
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
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        qrImage.onload = () => {
          // Draw QR code in bottom right
          const qrSize = 120;
          const qrX = 1050;
          const qrY = 480;
          
          ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
          
          // Add border around QR code
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
          
          resolve(canvas.toDataURL('image/png'));
        };
        
        qrImage.onerror = () => {
          // If QR code fails to load, just return the image without it
          resolve(canvas.toDataURL('image/png'));
        };
        
        qrImage.src = urlData.qr;
      });
    } catch (error) {
      console.error('Error loading QR code:', error);
      return canvas.toDataURL('image/png');
    }
  }
  
  return canvas.toDataURL('image/png');
};

// Function to download the generated image
export const downloadSocialPreview = async (urlData, filename) => {
  try {
    const imageDataUrl = await generateSocialPreviewImage(urlData);
    
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${urlData.title}_social_preview.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating social preview:', error);
    return false;
  }
};

// Function to get social media meta tags for a URL
export const getSocialMetaTags = (urlData) => {
  const shortUrl = `${window.location.origin}/${urlData.custom_url || urlData.short_url}`;
  
  return {
    title: urlData.title || 'Shortened URL',
    description: `Visit ${urlData.title || 'this link'} via LOL URL`,
    url: shortUrl,
    image: `${window.location.origin}/api/social-preview/${urlData.id}`,
    type: 'website'
  };
}; 