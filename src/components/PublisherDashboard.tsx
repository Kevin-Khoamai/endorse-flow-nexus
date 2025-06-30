
import React, { useState } from 'react';
import Layout from './Layout';
import TransactionStatusListWithUpload from './TransactionStatusListWithUpload';
import CampaignDetailsDialog from './CampaignDetailsDialog';
import ApplicationDialog from './ApplicationDialog';
import VideoUploadDialog from './VideoUploadDialog';
import CampaignGrid from './CampaignGrid';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';

interface PublisherDashboardProps {
  onBack: () => void;
}

const PublisherDashboard = ({ onBack }: PublisherDashboardProps) => {
  const { toast } = useToast();
  const { campaigns, loading } = useCampaigns();
  const { applications, createApplication } = useApplications();
  const { createVideo } = useVideos();
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showVideoUploadDialog, setShowVideoUploadDialog] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetails(true);
  };

  const handleApply = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowApplicationDialog(true);
    setShowCampaignDetails(false);
  };

  const handleSubmitApplication = async (applicationData: {
    experience: string;
    audience: string;
    videoIdeas: string;
  }) => {
    if (!selectedCampaign) return;

    const { error } = await createApplication({
      campaign_id: selectedCampaign.id,
      experience: applicationData.experience,
      audience: applicationData.audience,
      videoIdeas: applicationData.videoIdeas
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your application has been sent for SP Team review.",
    });
    
    setShowApplicationDialog(false);
    setSelectedCampaign(null);
  };

  const handleUploadVideo = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setShowVideoUploadDialog(true);
  };

  const handleSubmitVideo = async (videoData: {
    title: string;
    url: string;
    description: string;
  }) => {
    if (!selectedApplicationId || !videoData.title || !videoData.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await createVideo({
      application_id: selectedApplicationId,
      title: videoData.title,
      url: videoData.url,
      description: videoData.description
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Video Submitted",
      description: "Your video has been uploaded and sent for SP Team approval.",
    });
    
    setShowVideoUploadDialog(false);
    setSelectedApplicationId('');
  };

  if (loading) {
    return (
      <Layout title="Publisher Dashboard" onBack={onBack}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const selectedApplication = applications.find(app => app.id === selectedApplicationId);

  return (
    <Layout title="Publisher Dashboard" onBack={onBack}> 
      <div className="space-y-8">
        <TransactionStatusListWithUpload onUploadVideo={handleUploadVideo} />

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Campaigns</h2>
          <CampaignGrid
            campaigns={campaigns}
            applications={applications}
            onViewDetails={handleViewDetails}
            onApply={handleApply}
          />
        </div>
      </div>

      <CampaignDetailsDialog
        campaign={selectedCampaign}
        isOpen={showCampaignDetails}
        onClose={() => {
          setShowCampaignDetails(false);
          setSelectedCampaign(null);
        }}
        onApply={handleApply}
      />

      <ApplicationDialog
        campaign={selectedCampaign}
        isOpen={showApplicationDialog}
        onClose={() => {
          setShowApplicationDialog(false);
          setSelectedCampaign(null);
        }}
        onSubmit={handleSubmitApplication}
        isApplicationDisabled={applications.some(app => 
          app.campaign_id === selectedCampaign?.id && 
          (app.status === 'sp_approved' || app.status === 'advertiser_approved')
        )}
      />

      <VideoUploadDialog
        isOpen={showVideoUploadDialog}
        onClose={() => {
          setShowVideoUploadDialog(false);
          setSelectedApplicationId('');
        }}
        onSubmit={handleSubmitVideo}
        selectedApplication={selectedApplication || null}
      />
    </Layout>
  );
};

export default PublisherDashboard;
