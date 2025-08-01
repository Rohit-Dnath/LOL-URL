import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Share2, Eye, EyeOff } from 'lucide-react';
import { generateSocialPreviewImage, downloadSocialPreview } from '@/utils/socialPreview';
import { toast } from 'react-toastify';
import { toastConfig } from '@/utils/toastConfig';

const SocialPreviewCard = ({ url }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const imageDataUrl = await generateSocialPreviewImage(url);
      setPreviewImage(imageDataUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview image', toastConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!previewImage) {
      await generatePreview();
    }
    
    const success = await downloadSocialPreview(url, `${url.title}_social_preview.png`);
    if (success) {
      toast.success('Social preview downloaded successfully!', toastConfig);
    } else {
      toast.error('Failed to download preview', toastConfig);
    }
  };

  const handleShare = async () => {
    if (!previewImage) {
      await generatePreview();
    }

    try {
      // Convert data URL to blob for sharing
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = new File([blob], `${url.title}_preview.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: url.title,
          text: `Check out this link: ${window.location.origin}/${url.custom_url || url.short_url}`,
          files: [file]
        });
      } else {
        // Fallback: copy link to clipboard
        const shortUrl = `${window.location.origin}/${url.custom_url || url.short_url}`;
        await navigator.clipboard.writeText(shortUrl);
        toast.success('Link copied to clipboard!', toastConfig);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share', toastConfig);
    }
  };

  return (
    <Card className="bg-background rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Social Media Preview</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-white hover:bg-gray-700"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPreview ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Generate a social media preview image for this URL</p>
            <Button
              onClick={generatePreview}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? 'Generating...' : 'Generate Preview'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {previewImage && (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Social media preview"
                  className="w-full rounded-lg border border-gray-600"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  1200×630
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
            </div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Optimized for Twitter, Facebook, LinkedIn</p>
              <p>• Includes QR code for easy access</p>
              <p>• Professional gradient design</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialPreviewCard; 