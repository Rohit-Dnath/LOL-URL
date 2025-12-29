import { prisma } from './prisma';
import { nanoid } from 'nanoid';

/**
 * URL Operations with Advanced Features
 */

// Generate unique short code
export function generateShortCode(length = 6) {
  return nanoid(length);
}

// Create URL with advanced features
export async function createUrl({
  originalUrl,
  customSlug,
  title,
  description,
  userId,
  workspaceId,
  qrCode,
  expiresAt,
  password,
  // UTM parameters
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  // Targeting
  deviceTargeting,
  geoTargeting,
  // Social preview
  socialTitle,
  socialDescription,
  socialImage,
}) {
  const shortCode = customSlug || generateShortCode();

  // Check if shortCode already exists
  const existing = await prisma.url.findUnique({
    where: { shortCode }
  });

  if (existing) {
    throw new Error('Short code already exists');
  }

  // Build URL with UTM parameters if provided
  let finalUrl = originalUrl;
  if (utmSource || utmMedium || utmCampaign) {
    const url = new URL(originalUrl);
    if (utmSource) url.searchParams.set('utm_source', utmSource);
    if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
    if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
    if (utmTerm) url.searchParams.set('utm_term', utmTerm);
    if (utmContent) url.searchParams.set('utm_content', utmContent);
    finalUrl = url.toString();
  }

  return await prisma.url.create({
    data: {
      originalUrl: finalUrl,
      shortCode,
      customSlug: customSlug || null,
      title,
      description,
      userId,
      workspaceId,
      qrCode,
      expiresAt,
      password,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      workspace: true
    }
  });
}

// Get URLs for user
export async function getUrls(userId, workspaceId = null) {
  const where = workspaceId 
    ? { workspaceId }
    : { userId, workspaceId: null };

  return await prisma.url.findMany({
    where,
    include: {
      clicks: {
        select: {
          id: true,
          timestamp: true,
          isUnique: true
        }
      },
      _count: {
        select: { clicks: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Get single URL with analytics
export async function getUrl(shortCode, userId = null) {
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      workspace: true,
      clicks: {
        orderBy: { timestamp: 'desc' },
        take: 100
      },
      _count: {
        select: { clicks: true }
      }
    }
  });

  // Check if user has access
  if (userId && url && url.userId !== userId) {
    // Check if user is workspace member
    if (url.workspaceId) {
      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId: url.workspaceId
          }
        }
      });
      if (!member) {
        throw new Error('Access denied');
      }
    } else {
      throw new Error('Access denied');
    }
  }

  return url;
}

// Get URL for redirect (public)
export async function getUrlForRedirect(shortCode) {
  const url = await prisma.url.findFirst({
    where: {
      OR: [
        { shortCode },
        { customSlug: shortCode }
      ],
      disabled: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
  });

  return url;
}

// Update URL
export async function updateUrl(shortCode, userId, data) {
  const url = await getUrl(shortCode, userId);
  
  if (!url) {
    throw new Error('URL not found or access denied');
  }

  return await prisma.url.update({
    where: { id: url.id },
    data
  });
}

// Delete URL
export async function deleteUrl(shortCode, userId) {
  const url = await getUrl(shortCode, userId);
  
  if (!url) {
    throw new Error('URL not found or access denied');
  }

  return await prisma.url.delete({
    where: { id: url.id }
  });
}

// Check if custom slug is available
export async function isSlugAvailable(slug) {
  const existing = await prisma.url.findUnique({
    where: { shortCode: slug }
  });
  return !existing;
}

// Get URL analytics summary
export async function getUrlAnalytics(shortCode, userId) {
  const url = await getUrl(shortCode, userId);
  
  if (!url) {
    throw new Error('URL not found or access denied');
  }

  const [totalClicks, uniqueClicks, clicksByCountry, clicksByDevice, clicksByBrowser, recentClicks] = await Promise.all([
    // Total clicks
    prisma.click.count({
      where: { urlId: url.id }
    }),
    
    // Unique clicks
    prisma.click.count({
      where: { urlId: url.id, isUnique: true }
    }),
    
    // Clicks by country
    prisma.click.groupBy({
      by: ['country'],
      where: { urlId: url.id, country: { not: null } },
      _count: true,
      orderBy: { _count: { country: 'desc' } },
      take: 10
    }),
    
    // Clicks by device
    prisma.click.groupBy({
      by: ['device'],
      where: { urlId: url.id, device: { not: null } },
      _count: true
    }),
    
    // Clicks by browser
    prisma.click.groupBy({
      by: ['browser'],
      where: { urlId: url.id, browser: { not: null } },
      _count: true,
      orderBy: { _count: { browser: 'desc' } },
      take: 10
    }),
    
    // Recent clicks
    prisma.click.findMany({
      where: { urlId: url.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
      select: {
        id: true,
        timestamp: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        referer: true,
        isUnique: true
      }
    })
  ]);

  return {
    url,
    totalClicks,
    uniqueClicks,
    clicksByCountry,
    clicksByDevice,
    clicksByBrowser,
    recentClicks
  };
}
