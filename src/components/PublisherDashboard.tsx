
import React, { useState } from 'react';
import Layout from './Layout';
import TransactionStatusListWithUpload from './TransactionStatusListWithUpload';
import CampaignDetailsDialog from './CampaignDetailsDialog';
import ApplicationDialog from './ApplicationDialog';
import VideoUploadDialog from './VideoUploadDialog';
import CampaignGrid from './CampaignGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { videos, createVideo } = useVideos();
  
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

  const getVideoStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sp_approved': return 'bg-blue-100 text-blue-800';
      case 'sp_rejected': return 'bg-red-100 text-red-800';
      case 'advertiser_approved': return 'bg-green-100 text-green-800';
      case 'advertiser_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVideoStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': 
      case 'sp_approved': 
        return <Clock className="w-4 h-4" />;
      case 'advertiser_approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sp_rejected': 
      case 'advertiser_rejected': 
        return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatVideoStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending SP Review';
      case 'sp_approved': return 'SP Approved - Pending Advertiser';
      case 'sp_rejected': return 'SP Rejected';
      case 'advertiser_approved': return 'Approved';
      case 'advertiser_rejected': return 'Advertiser Rejected';
      default: return status;
    }
  };

  const handleUploadToTikTok = (videoId: string, videoUrl: string) => {
    // Open TikTok upload page with the video URL
    window.open(`https://www.tiktok.com/upload?video_url=${encodeURIComponent(videoUrl)}`, '_blank');
    
    toast({
      title: "Redirecting to TikTok",
      description: "You'll be redirected to TikTok to upload your approved video.",
    });
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

        {/* Video Submissions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No videos uploaded yet. Upload your first video using the buttons above!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Video Title</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded Date</TableHead>
                      <TableHead>Video URL</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">
                          {video.title}
                        </TableCell>
                        <TableCell>
                          {video.application?.campaign?.title || 'Unknown Campaign'} - {video.application?.campaign?.brand || 'Unknown Brand'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={getVideoStatusColor(video.status)}>
                              {formatVideoStatus(video.status)}
                            </Badge>
                            {getVideoStatusIcon(video.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(video.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Video
                          </a>
                        </TableCell>
                        <TableCell>
                          {video.status === 'advertiser_approved' && (
                            <Button
                              onClick={() => handleUploadToTikTok(video.id, video.url)}
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              Upload to TikTok
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

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
