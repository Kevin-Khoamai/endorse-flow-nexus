
import React, { useState } from 'react';
import Layout from './Layout';
import CampaignCard from './CampaignCard';
import TransactionStatusList from './TransactionStatusList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showVideoUploadDialog, setShowVideoUploadDialog] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [applicationData, setApplicationData] = useState({
    experience: '',
    audience: '',
    videoIdeas: ''
  });
  const [videoData, setVideoData] = useState({
    title: '',
    url: '',
    description: ''
  });

  // Get approved applications for video upload
  const approvedApplications = applications.filter(app => app.status === 'sp_approved' || app.status === 'advertiser_approved');

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleApply = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowApplicationDialog(true);
  };

  const handleSubmitApplication = async () => {
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
    setApplicationData({ experience: '', audience: '', videoIdeas: '' });
    setSelectedCampaign(null);
  };

  const handleUploadVideo = () => {
    setShowVideoUploadDialog(true);
  };

  const handleSubmitVideo = async () => {
    
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
    setVideoData({ title: '', url: '', description: '' });
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

  return (
    <Layout 
      title="Publisher Dashboard" 
      onBack={onBack}
      headerAction={
        approvedApplications.length > 0 && (
          <div className="w-full justify-start mb-6 flex items-center">
              <Button onClick={handleUploadVideo} variant="outline">
               Upload Video
              </Button>
          </div>
      )}
    > 
      
      <div className="space-y-8">
        {/* Transaction Status List */}
        <TransactionStatusList />

         

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Campaigns</h2>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No active campaigns available at the moment.</p>
              <p className="text-sm text-gray-500">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                // Find if publisher already applied and got approval for this campaign
                const isAppliedAndApproved = applications.some(app => app.campaign_id === campaign.id && (app.status === 'sp_approved' || app.status === 'advertiser_approved' || app.status === 'pending'))
                return (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onViewDetails={handleViewDetails}
                    onApply={handleApply}
                    isAppliedAndApproved={isAppliedAndApproved}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Details Dialog */}
      <Dialog open={!!selectedCampaign && !showApplicationDialog} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.title}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Brand</h4>
                <p className="text-gray-600">{selectedCampaign.brand}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedCampaign.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Budget Range</h4>
                <p className="text-gray-600">{selectedCampaign.budget || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deadline</h4>
                <p className="text-gray-600">{selectedCampaign.deadline || 'Not specified'}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleApply(selectedCampaign)}>
                  Apply for Campaign
                </Button>
                <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {selectedCampaign?.title}</DialogTitle>
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
              <Button onClick={handleSubmitApplication} disabled={
                applications.some(app => app.campaign_id === selectedCampaign?.id && (app.status === 'sp_approved' || app.status === 'advertiser_approved'))
              }>
                Submit Application
              </Button>
              <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Upload Dialog */}
      <Dialog open={showVideoUploadDialog} onOpenChange={setShowVideoUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Campaign</label>
              <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId} disabled={approvedApplications.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={approvedApplications.length === 0 ? "No approved campaigns available" : "Choose an approved campaign..."} />
                </SelectTrigger>
                <SelectContent>
                  {approvedApplications.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">No approved campaigns available</div>
                  ) : (
                    approvedApplications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.campaign?.title} - {app.campaign?.brand}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
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
            <div className="flex justify-center mb-6" >
              <Button onClick={handleSubmitVideo}>Upload Video</Button>
              <Button variant="outline" onClick={() => setShowVideoUploadDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PublisherDashboard;
