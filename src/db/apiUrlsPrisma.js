/**
 * Client-side API wrapper for URL operations using Prisma
 * These functions make fetch calls to serverless functions that use Prisma
 */

// For development/local testing, we can directly import Prisma operations
// In production, these would call API routes
import { createUrl as prismaCreateUrl, getUrls as getUserUrls, getUrl as getUrlById, deleteUrl as prismaDeleteUrl, isSlugAvailable } from '@/lib/db/urls';
import { upload } from '@vercel/blob/client';

/**
 * Get all URLs for a user
 */
export async function getUrls(userId) {
  try {
    const urls = await getUserUrls(userId);
    return urls;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    throw new Error('Unable to load URLs');
  }
}

/**
 * Get a single URL by ID
 */
export async function getUrl({ id, userId }) {
  try {
    const url = await getUrlById(id, userId);
    if (!url) {
      throw new Error('URL not found');
    }
    return url;
  } catch (error) {
    console.error('Error fetching URL:', error);
    throw new Error('Short URL not found');
  }
}

/**
 * Get URL for redirect (public access)
 */
export async function getLongUrl(shortCode) {
  try {
    // This would typically be an API call
    const response = await fetch(`/api/urls/redirect/${shortCode}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching long URL:', error);
    return null;
  }
}

/**
 * Create a new shortened URL with QR code
 */
export async function createUrl({ title, longUrl, customUrl, user_id }, qrBlob) {
  try {
    // Upload QR code to storage
    const fileName = `qr-${customUrl || Date.now()}.png`;
    
    let qrUrl;
    if (qrBlob) {
      // Upload to Vercel Blob Storage
      const blob = await upload(fileName, qrBlob, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      qrUrl = blob.url;
    }

    // Create URL in database
    const urlData = await prismaCreateUrl({
      originalUrl: longUrl,
      customSlug: customUrl,
      title,
      userId: user_id,
      qrCode: qrUrl,
    });

    // Return in Supabase format for compatibility
    return [{
      id: urlData.id,
      title: urlData.title,
      original_url: urlData.originalUrl,
      short_url: urlData.shortCode,
      custom_url: urlData.customSlug,
      qr: urlData.qrCode,
      user_id: urlData.userId,
      created_at: urlData.createdAt,
    }];
  } catch (error) {
    console.error('Error creating URL:', error);
    throw new Error('Error creating short URL');
  }
}

/**
 * Delete a URL
 */
export async function deleteUrl(id) {
  try {
    await prismaDeleteUrl(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting URL:', error);
    throw new Error('Unable to delete URL');
  }
}

/**
 * Check if custom URL already exists
 */
export async function checkCustomUrlExists(customUrl) {
  try {
    const available = await isSlugAvailable(customUrl);
    return !available; // Return true if exists (not available)
  } catch (error) {
    console.error('Error checking URL availability:', error);
    throw new Error('Error checking custom URL');
  }
}
