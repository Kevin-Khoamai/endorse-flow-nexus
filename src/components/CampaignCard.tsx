
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails?: (campaign: Campaign) => void;
  onApply?: (campaign: Campaign) => void;
  showActions?: boolean;
  isAppliedAndApproved?: boolean;
}

const CampaignCard = ({ campaign, onViewDetails, onApply, showActions = true, isAppliedAndApproved = false }: CampaignCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{campaign.brand}</p>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{campaign.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium">{campaign.budget}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Deadline:</span>
            <span className="font-medium">{campaign.deadline}</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Requirements:</p>
          <div className="flex flex-wrap gap-1">
            {campaign.requirements.map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" onClick={() => onViewDetails(campaign)}>
                View Details
              </Button>
            )}
            {onApply && campaign.status === 'active' && (
              <Button onClick={() => onApply(campaign)} disabled={isAppliedAndApproved}>
                Apply Now
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
