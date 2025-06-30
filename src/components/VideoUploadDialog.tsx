
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CampaignApplication } from '@/hooks/useApplications';

interface VideoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; url: string; description: string }) => void;
  selectedApplication: CampaignApplication | null;
}

const VideoUploadDialog = ({ isOpen, onClose, onSubmit, selectedApplication }: VideoUploadDialogProps) => {
  const [videoData, setVideoData] = useState({
    title: '',
    url: '',
    description: ''
  });

  const handleSubmit = () => {
    onSubmit(videoData);
    setVideoData({ title: '', url: '', description: '' });
  };

  const handleClose = () => {
    onClose();
    setVideoData({ title: '', url: '', description: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedApplication && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Campaign:</strong> {selectedApplication.campaign?.title} - {selectedApplication.campaign?.brand}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Video Title</label>
            <Input
              placeholder="Enter video title..."
              value={videoData.title}
              onChange={(e) => setVideoData({...videoData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={videoData.url}
              onChange={(e) => setVideoData({...videoData, url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              placeholder="Describe your video content..."
              value={videoData.description}
              onChange={(e) => setVideoData({...videoData, description: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit}>Upload Video</Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
