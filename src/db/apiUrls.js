// Mock API for URLs - Replace with your Prisma/Neon backend API calls

export async function getUrls(user_id) {
  // TODO: Replace with actual API call to your Prisma backend
  // Example: const response = await fetch('/api/urls?user_id=' + user_id);
  console.log('getUrls called for user:', user_id);
  
  // Return mock data for now
  return JSON.parse(localStorage.getItem(`urls_${user_id}`) || '[]');
}

export async function getUrl({ id, user_id }) {
  // TODO: Replace with actual API call
  console.log('getUrl called:', { id, user_id });
  
  const urls = JSON.parse(localStorage.getItem(`urls_${user_id}`) || '[]');
  const url = urls.find(u => u.id === id);
  
  if (!url) {
    throw new Error("Short URL not found");
  }
  
  return url;
}

export async function getLongUrl(id) {
  // TODO: Replace with actual API call
  console.log('getLongUrl called:', id);
  
  // Search through all users' URLs (in production, this would be a DB query)
  const allUrls = Object.keys(localStorage)
    .filter(key => key.startsWith('urls_'))
    .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'));
  
  const url = allUrls.find(u => u.short_url === id || u.custom_url === id);
  
  if (!url) {
    return null;
  }
  
  return {
    id: url.id,
    original_url: url.original_url
  };
}

export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
  // TODO: Replace with actual API call to your backend
  console.log('createUrl called:', { title, longUrl, customUrl, user_id });
  
  const short_url = Math.random().toString(36).substr(2, 6);
  
  // Convert QR code to data URL for storage
  let qr = null;
  if (qrcode) {
    const reader = new FileReader();
    qr = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(qrcode);
    });
  }
  
  const newUrl = {
    id: Date.now().toString(),
    title,
    original_url: longUrl,
    custom_url: customUrl || null,
    user_id,
    short_url,
    qr,
    created_at: new Date().toISOString()
  };
  
  const urls = JSON.parse(localStorage.getItem(`urls_${user_id}`) || '[]');
  urls.push(newUrl);
  localStorage.setItem(`urls_${user_id}`, JSON.stringify(urls));
  
  return [newUrl];
}

export async function deleteUrl(id) {
  // TODO: Replace with actual API call
  console.log('deleteUrl called:', id);
  
  // Find and delete from all users (in production, use proper auth)
  Object.keys(localStorage)
    .filter(key => key.startsWith('urls_'))
    .forEach(key => {
      const urls = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = urls.filter(u => u.id !== id);
      if (filtered.length !== urls.length) {
        localStorage.setItem(key, JSON.stringify(filtered));
      }
    });
  
  return true;
}

export async function checkCustomUrlExists(customUrl) {
  // TODO: Replace with actual API call
  console.log('checkCustomUrlExists called:', customUrl);
  
  const allUrls = Object.keys(localStorage)
    .filter(key => key.startsWith('urls_'))
    .flatMap(key => JSON.parse(localStorage.getItem(key) || '[]'));
  
  return allUrls.some(u => u.custom_url === customUrl);
}
