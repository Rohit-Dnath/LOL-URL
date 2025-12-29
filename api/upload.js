/**
 * Serverless function for file uploads (QR codes, etc.)
 * Required for Vercel Blob upload
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Optionally, add authentication here
        return {
          allowedContentTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
