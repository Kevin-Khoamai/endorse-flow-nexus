import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';

interface AdvertiserDashboardProps {
  onBack: () => void;
}

const AdvertiserDashboard = ({ onBack }: AdvertiserDashboardProps) => {
  const { toast } = useToast();
  const { campaigns, loading, createCampaign } = useCampaigns();
  const { applications } = useApplications();
  const { videos } = useVideos();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    brand: '',
    budget: '',
    deadline: '',
    description: '',
    requirements: ''
  });

  // Add state for viewing applications
  const [selectedCampaignForApps, setSelectedCampaignForApps] = useState<any>(null);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);

  // Add state for reviewing videos
  const [selectedCampaignForVideos, setSelectedCampaignForVideos] = useState<any>(null);
  const [showVideosDialog, setShowVideosDialog] = useState(false);

  // Add state for viewing campaign analytics
  const [selectedCampaignForAnalytics, setSelectedCampaignForAnalytics] = useState<any>(null);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.brand || !newCampaign.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await createCampaign({
      title: newCampaign.title,
      brand: newCampaign.brand,
      budget: newCampaign.budget,
      deadline: newCampaign.deadline,
      description: newCampaign.description,
      requirements: newCampaign.requirements.split(',').map(req => req.trim()).filter(req => req),
      status: 'active'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setShowCreateCampaign(false);
    setNewCampaign({
      title: '',
      brand: '',
      budget: '',
      deadline: '',
      description: '',
      requirements: ''
    });

    toast({
      title: "Campaign Created",
      description: "Your campaign has been published and is now active.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout title="Advertiser Dashboard" onBack={onBack}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Advertiser Dashboard" 
      onBack={onBack}
      headerAction={
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Campaign Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <p className="text-sm text-gray-600">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <p className="text-sm text-gray-600">Videos Submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Campaigns</h2>
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-4">No campaigns created yet.</p>
                <Button onClick={() => setShowCreateCampaign(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
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
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Budget:</span>
                        <p className="font-medium">{campaign.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Deadline:</span>
                        <p className="font-medium">{campaign.deadline || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Applications:</span>
                        <p className="font-medium">0</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Videos:</span>
                        <p className="font-medium">0</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCampaignForApps(campaign);
                          setShowApplicationsDialog(true);
                        }}
                      >
                        View Applications
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCampaignForVideos(campaign);
                          setShowVideosDialog(true);
                        }}
                      >
                        Review Videos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCampaignForAnalytics(campaign);
                          setShowAnalyticsDialog(true);
                        }}
                      >
                        Campaign Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Title *</label>
              <Input
                placeholder="Enter campaign title..."
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name *</label>
              <Input
                placeholder="Enter brand name..."
                value={newCampaign.brand}
                onChange={(e) => setNewCampaign({...newCampaign, brand: e.target.value})}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Range</label>
                <Input
                  placeholder="e.g. $500-$1,500"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={newCampaign.deadline}
                  onChange={(e) => setNewCampaign({...newCampaign, deadline: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                placeholder="Describe your campaign goals and expectations..."
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Requirements (comma-separated)</label>
              <Input
                placeholder="e.g. Fashion, 10K+ followers, Video content"
                value={newCampaign.requirements}
                onChange={(e) => setNewCampaign({...newCampaign, requirements: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog open={showApplicationsDialog} onOpenChange={setShowApplicationsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Applications for {selectedCampaignForApps?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {applications
              .filter(app => app.campaign_id === selectedCampaignForApps?.id)
              .length === 0 ? (
              <p>No applications found for this campaign.</p>
            ) : (
              applications
                .filter(app => app.campaign_id === selectedCampaignForApps?.id)
                .map(app => (
                  <div key={app.id} className="border p-4 rounded">
                    <div>
                      <strong>Publisher:</strong> {app.publisher?.full_name || app.publisher_id}
                    </div>
                    <div>
                      <strong>Status:</strong> {app.status}
                    </div>
                    <div>
                      <strong>Message:</strong> {app.message || 'N/A'}
                    </div>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Videos Dialog */}
      <Dialog open={showVideosDialog} onOpenChange={setShowVideosDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Videos for {selectedCampaignForVideos?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {videos
              .filter(video => video.application?.campaign?.title === selectedCampaignForVideos?.title)
              .length === 0 ? (
              <p>No videos found for this campaign.</p>
            ) : (
              videos
                .filter(video => video.application?.campaign?.title === selectedCampaignForVideos?.title)
                .map(video => (
                  <div key={video.id} className="border p-4 rounded">
                    <div>
                      <strong>Publisher:</strong> {video.application?.publisher?.full_name}
                    </div>
                    <div>
                      <strong>Title:</strong> {video.title}
                    </div>
                    <div>
                      <strong>Status:</strong> {video.status}
                    </div>
                    <div>
                      <strong>URL:</strong> <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a>
                    </div>
                    <div>
                      <strong>Description:</strong> {video.description || 'N/A'}
                    </div>
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Analytics for {selectedCampaignForAnalytics?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <strong>Brand:</strong> {selectedCampaignForAnalytics?.brand}
            </div>
            <div>
              <strong>Description:</strong> {selectedCampaignForAnalytics?.description}
            </div>
            <div>
              <strong>Budget:</strong> {selectedCampaignForAnalytics?.budget}
            </div>
            <div>
              <strong>Deadline:</strong> {selectedCampaignForAnalytics?.deadline}
            </div>
            <div>
              <strong>Total Applications:</strong> {
                applications.filter(app => app.campaign_id === selectedCampaignForAnalytics?.id).length
              }
            </div>
            <div>
              <strong>Total Videos:</strong> {
                videos.filter(video => video.application?.campaign?.title === selectedCampaignForAnalytics?.title).length
              }
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdvertiserDashboard;
