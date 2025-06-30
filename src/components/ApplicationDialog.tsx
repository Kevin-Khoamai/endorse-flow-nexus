
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Campaign } from '@/hooks/useCampaigns';

interface ApplicationDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { experience: string; audience: string; videoIdeas: string }) => void;
  isApplicationDisabled: boolean;
}

const ApplicationDialog = ({ campaign, isOpen, onClose, onSubmit, isApplicationDisabled }: ApplicationDialogProps) => {
  const [applicationData, setApplicationData] = useState({
    experience: '',
    audience: '',
    videoIdeas: ''
  });

  const handleSubmit = () => {
    onSubmit(applicationData);
    setApplicationData({ experience: '', audience: '', videoIdeas: '' });
  };

  const handleClose = () => {
    onClose();
    setApplicationData({ experience: '', audience: '', videoIdeas: '' });
  };

  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {campaign.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Experience</label>
            <Textarea
              placeholder="Tell us about your experience with similar campaigns..."
              value={applicationData.experience}
              onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Audience Information</label>
            <Textarea
              placeholder="Describe your audience demographics and engagement..."
              value={applicationData.audience}
              onChange={(e) => setApplicationData({...applicationData, audience: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Video Ideas</label>
            <Textarea
              placeholder="Share your creative ideas for this campaign..."
              value={applicationData.videoIdeas}
              onChange={(e) => setApplicationData({...applicationData, videoIdeas: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={isApplicationDisabled}>
              Submit Application
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
