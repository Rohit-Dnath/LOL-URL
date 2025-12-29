import { prisma } from './prisma';
import crypto from 'crypto';

/**
 * Click Tracking with Unique Visitor Detection
 */

// Hash IP address for privacy
export function hashIP(ip) {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.NEXTAUTH_SECRET)
    .digest('hex');
}

// Store click with unique tracking
export async function storeClick({
  urlId,
  fingerprint,
  ipAddress,
  country,
  city,
  device,
  browser,
  os,
  referer,
  userAgent
}) {
  // Hash IP for privacy
  const ipHash = hashIP(ipAddress);

  // Check if this fingerprint has clicked this URL before
  const existingClick = await prisma.click.findFirst({
    where: {
      urlId,
      fingerprint
    }
  });

  const isUnique = !existingClick;

  return await prisma.click.create({
    data: {
      urlId,
      fingerprint,
      ipHash,
      country,
      city,
      device,
      browser,
      os,
      referer,
      isUnique
    }
  });
}

// Get clicks for URL
export async function getClicksForUrl(urlId) {
  return await prisma.click.findMany({
    where: { urlId },
    orderBy: { timestamp: 'desc' }
  });
}

// Get clicks for multiple URLs
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) {
    return [];
  }

  return await prisma.click.findMany({
    where: {
      urlId: { in: urlIds }
    },
    orderBy: { timestamp: 'desc' }
  });
}

// Get analytics for date range
export async function getClicksInRange(urlId, startDate, endDate) {
  return await prisma.click.findMany({
    where: {
      urlId,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { timestamp: 'asc' }
  });
}

// Get click timeseries data
export async function getClickTimeseries(urlId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const clicks = await prisma.click.findMany({
    where: {
      urlId,
      timestamp: { gte: startDate }
    },
    select: {
      timestamp: true,
      isUnique: true
    }
  });

  // Group by day
  const grouped = {};
  clicks.forEach(click => {
    const day = click.timestamp.toISOString().split('T')[0];
    if (!grouped[day]) {
      grouped[day] = { total: 0, unique: 0 };
    }
    grouped[day].total++;
    if (click.isUnique) {
      grouped[day].unique++;
    }
  });

  return Object.entries(grouped).map(([date, data]) => ({
    date,
    ...data
  }));
}

// Get top referrers
export async function getTopReferrers(urlId, limit = 10) {
  return await prisma.click.groupBy({
    by: ['referer'],
    where: {
      urlId,
      referer: { not: null }
    },
    _count: true,
    orderBy: {
      _count: { referer: 'desc' }
    },
    take: limit
  });
}

// Export clicks data
export async function exportClicksData(urlId, format = 'json') {
  const clicks = await prisma.click.findMany({
    where: { urlId },
    orderBy: { timestamp: 'desc' },
    select: {
      timestamp: true,
      country: true,
      city: true,
      device: true,
      browser: true,
      os: true,
      referer: true,
      isUnique: true
    }
  });

  if (format === 'csv') {
    // Convert to CSV
    const headers = ['timestamp', 'country', 'city', 'device', 'browser', 'os', 'referer', 'isUnique'];
    const rows = clicks.map(click => [
      click.timestamp,
      click.country || '',
      click.city || '',
      click.device || '',
      click.browser || '',
      click.os || '',
      click.referer || '',
      click.isUnique ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  return clicks; // JSON format
}
