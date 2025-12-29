/**
 * Client-side API wrapper for Click operations using Prisma
 */

import { getClicksForUrls as getClicksByUrlIds, storeClick as prismaStoreClick } from '@/lib/db/clicks';

/**
 * Get all clicks for multiple URLs
 */
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) {
    return [];
  }

  try {
    const clicks = await getClicksByUrlIds(urlIds);
    
    // Transform to Supabase format for compatibility
    return clicks.map(click => ({
      id: click.id,
      url_id: click.urlId,
      created_at: click.timestamp,
      country: click.country,
      city: click.city,
      device: click.device,
      browser: click.browser,
      os: click.os,
      referer: click.referer,
      ip: click.ipHash, // Use hashed IP
    }));
  } catch (error) {
    console.error('Error fetching clicks:', error);
    return [];
  }
}

/**
 * Get clicks for a single URL
 */
export async function getClicksForUrl(urlId) {
  try {
    const clicks = await getClicksByUrlIds([urlId]);
    
    return clicks.map(click => ({
      id: click.id,
      url_id: click.urlId,
      created_at: click.timestamp,
      country: click.country,
      city: click.city,
      device: click.device,
      browser: click.browser,
      os: click.os,
      referer: click.referer,
      ip: click.ipHash,
    }));
  } catch (error) {
    console.error('Error fetching clicks:', error);
    return [];
  }
}

/**
 * Store a click event
 */
export async function storeClicks({ id, originalUrl }) {
  try {
    // Get browser fingerprint (you'll need to implement this)
    const fingerprint = await getBrowserFingerprint();
    
    // Get geolocation and device info
    const deviceInfo = getDeviceInfo();
    
    await prismaStoreClick({
      urlId: id,
      fingerprint,
      ...deviceInfo,
    });

    // Redirect to original URL
    return { success: true };
  } catch (error) {
    console.error('Error storing click:', error);
    return { success: false };
  }
}

/**
 * Get browser fingerprint using FingerprintJS
 */
async function getBrowserFingerprint() {
  try {
    if (typeof window === 'undefined') return null;
    
    // Dynamically import FingerprintJS
    const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    return null;
  }
}

/**
 * Get device information
 */
function getDeviceInfo() {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  
  // Simple device detection (you can enhance this)
  let device = 'Desktop';
  if (/Mobile/.test(ua)) device = 'Mobile';
  if (/Tablet/.test(ua)) device = 'Tablet';
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return {
    device,
    browser,
    os,
    referer: document.referrer || null,
  };
}
