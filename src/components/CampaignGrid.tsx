
import React from 'react';
import CampaignCard from './CampaignCard';
import { Campaign } from '@/hooks/useCampaigns';
import { CampaignApplication } from '@/hooks/useApplications';

interface CampaignGridProps {
  campaigns: Campaign[];
  applications: CampaignApplication[];
  onViewDetails: (campaign: Campaign) => void;
  onApply: (campaign: Campaign) => void;
}

const CampaignGrid = ({ campaigns, applications, onViewDetails, onApply }: CampaignGridProps) => {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No active campaigns available at the moment.</p>
        <p className="text-sm text-gray-500">Check back later for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const isAppliedAndApproved = applications.some(app => 
          app.campaign_id === campaign.id && 
          (app.status === 'sp_approved' || app.status === 'advertiser_approved' || app.status === 'pending')
        );
        
        return (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onViewDetails={onViewDetails}
            onApply={onApply}
            isAppliedAndApproved={isAppliedAndApproved}
          />
        );
      })}
    </div>
  );
};

export default CampaignGrid;
