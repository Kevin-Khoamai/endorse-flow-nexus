
import React, { useState } from 'react';
import Layout from './Layout';
import CampaignCard from './CampaignCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  deadline: string;
  requirements: string[];
  status: 'active' | 'pending' | 'completed';
  description: string;
}

interface PublisherDashboardProps {
  onBack: () => void;
}

const PublisherDashboard = ({ onBack }: PublisherDashboardProps) => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showVideoUploadDialog, setShowVideoUploadDialog] = useState(false);
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

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Summer Fashion Collection',
      brand: 'TrendyWear',
      budget: '$500-$1,500',
      deadline: '2024-07-15',
      requirements: ['Fashion', '10K+ followers', 'Video content'],
      status: 'active',
      description: 'Promote our latest summer collection with authentic styling videos'
    },
    {
      id: '2',
      title: 'Tech Product Launch',
      brand: 'InnovateTech',
      budget: '$1,000-$3,000',
      deadline: '2024-07-30',
      requirements: ['Technology', '25K+ followers', 'Product reviews'],
      status: 'active',
      description: 'Create engaging reviews for our new smartphone launch'
    },
    {
      id: '3',
      title: 'Fitness App Promotion',
      brand: 'FitLife',
      budget: '$300-$800',
      deadline: '2024-07-20',
      requirements: ['Fitness', '5K+ followers', 'App tutorials'],
      status: 'pending',
      description: 'Show how our fitness app helps achieve workout goals'
    }
  ];

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleApply = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowApplicationDialog(true);
  };

  const handleSubmitApplication = () => {
    toast({
      title: "Application Submitted",
      description: "Your application has been sent for SP Team review.",
    });
    setShowApplicationDialog(false);
    setApplicationData({ experience: '', audience: '', videoIdeas: '' });
  };

  const handleUploadVideo = () => {
    setShowVideoUploadDialog(true);
  };

  const handleSubmitVideo = () => {
    toast({
      title: "Video Submitted",
      description: "Your video has been uploaded and sent for approval.",
    });
    setShowVideoUploadDialog(false);
    setVideoData({ title: '', url: '', description: '' });
  };

  return (
    <Layout 
      title="Publisher Dashboard" 
      onBack={onBack}
      headerAction={
        <Button onClick={handleUploadVideo} variant="outline">
          Upload Video
        </Button>
      }
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Campaigns</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
              />
            ))}
          </div>
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
                <p className="text-gray-600">{selectedCampaign.budget}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deadline</h4>
                <p className="text-gray-600">{selectedCampaign.deadline}</p>
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
              <Button onClick={handleSubmitApplication}>Submit Application</Button>
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
