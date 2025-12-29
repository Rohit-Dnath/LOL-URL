/**
 * Serverless function for URL redirect
 * Handles GET /api/urls/redirect/:shortCode
 */
import { getUrlForRedirect } from '../../../src/lib/db/urls';

export default async function handler(req, res) {
  const { shortCode } = req.query;

  if (!shortCode) {
    return res.status(400).json({ error: 'Short code is required' });
  }

  try {
    const url = await getUrlForRedirect(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check if URL is expired
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'URL has expired' });
    }

    // Check if URL is disabled
    if (url.disabled) {
      return res.status(403).json({ error: 'URL has been disabled' });
    }

    return res.status(200).json({
      id: url.id,
      original_url: url.originalUrl,
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
