import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { generateSocialPreviewImage, downloadSocialPreview } from '@/utils/socialPreview';
import { toast } from 'react-toastify';
import { toastConfig } from '@/utils/toastConfig';

const SocialPreviewTest = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Test URL data
  const testUrlData = {
    id: 'test-123',
    title: 'Test URL for Social Preview',
    original_url: 'https://example.com/very-long-url-that-needs-to-be-shortened',
    short_url: 'abc123',
    custom_url: null,
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com',
    created_at: new Date().toISOString()
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const imageDataUrl = await generateSocialPreviewImage(testUrlData);
      setPreviewImage(imageDataUrl);
      toast.success('Preview generated successfully!', toastConfig);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview', toastConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPreview = async () => {
    if (!previewImage) {
      await generatePreview();
    }
    
    const success = await downloadSocialPreview(testUrlData, 'test_social_preview.png');
    if (success) {
      toast.success('Preview downloaded successfully!', toastConfig);
    } else {
      toast.error('Failed to download preview', toastConfig);
    }
  };

  return (
    <Card className="bg-background rounded-lg shadow-lg max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Social Media Preview Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Data</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Title:</strong> {testUrlData.title}</div>
              <div><strong>Original URL:</strong> {testUrlData.original_url}</div>
              <div><strong>Short URL:</strong> {testUrlData.short_url}</div>
              <div><strong>QR Code:</strong> Available</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={generatePreview}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? 'Generating...' : 'Generate Preview'}
              </Button>
              <Button
                onClick={downloadPreview}
                variant="outline"
                disabled={!previewImage}
              >
                Download Preview
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview Image</h3>
            {previewImage ? (
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
            ) : (
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No preview generated yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Features Tested</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Canvas-based image generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Gradient background design</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">QR code integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Text truncation for long URLs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Download functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Social media optimization</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPreviewTest; 