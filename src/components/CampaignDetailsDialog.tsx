
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignDetailsDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (campaign: Campaign) => void;
}

const CampaignDetailsDialog = ({ campaign, isOpen, onClose, onApply }: CampaignDetailsDialogProps) => {
  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{campaign.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Brand</h4>
            <p className="text-gray-600">{campaign.brand}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Budget Range</h4>
            <p className="text-gray-600">{campaign.budget || 'Not specified'}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Deadline</h4>
            <p className="text-gray-600">{campaign.deadline || 'Not specified'}</p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onApply(campaign)}>
              Apply for Campaign
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailsDialog;
