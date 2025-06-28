import React from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';
import SPTransactionStatusList from './SPTransactionStatusList';

interface SPTeamDashboardProps {
  onBack: () => void;
}

const SPTeamDashboard = ({ onBack }: SPTeamDashboardProps) => {
  const { toast } = useToast();
  const { applications, loading: applicationsLoading, updateApplicationStatus } = useApplications();
  const { videos, loading: videosLoading, updateVideoStatus } = useVideos();

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const pendingVideos = videos.filter(video => video.status === 'pending');

  const handleApplicationDecision = async (applicationId: string, decision: 'sp_approved' | 'sp_rejected') => {
    const { error } = await updateApplicationStatus(applicationId, decision);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: decision === 'sp_approved' ? "Application Approved" : "Application Rejected",
      description: `The application has been ${decision.replace('sp_', '')}.`,
    });
  };

  const handleVideoDecision = async (videoId: string, decision: 'sp_approved' | 'sp_rejected') => {
    const { error } = await updateVideoStatus(videoId, decision);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update video status. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: decision === 'sp_approved' ? "Video Approved" : "Video Rejected",
      description: `The video has been ${decision.replace('sp_', '')} and forwarded to advertiser.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sp_approved':
      case 'advertiser_approved': 
        return 'bg-green-100 text-green-800';
      case 'sp_rejected':
      case 'advertiser_rejected':
        return 'bg-red-100 text-red-800';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (applicationsLoading || videosLoading) {
    return (
      <Layout title="SP Team Dashboard" onBack={onBack}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="SP Team Dashboard" onBack={onBack}>
      <div className="space-y-8">
       

        {/* Applications Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Applications</h2>
          <div className="space-y-4">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No pending applications at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              pendingApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.publisher?.full_name || 'Publisher'}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{application.campaign?.title}</p>
                        <p className="text-sm text-gray-500">{application.campaign?.brand}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.message && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Application Details</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.message}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApplicationDecision(application.id, 'sp_approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApplicationDecision(application.id, 'sp_rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Video Submissions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Submissions</h2>
          <div className="space-y-4">
            {pendingVideos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No pending video submissions at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              pendingVideos.map((video) => (
                <Card key={video.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{video.application?.publisher?.full_name || 'Publisher'}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{video.application?.campaign?.title}</p>
                        <p className="text-sm text-gray-500">{video.application?.campaign?.brand}</p>
                      </div>
                      <Badge className={getStatusColor(video.status)}>
                        {video.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Video Title</h4>
                        <p className="text-sm text-gray-600">{video.title}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Video URL</h4>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {video.url}
                        </a>
                      </div>
                      {video.description && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Description</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleVideoDecision(video.id, 'sp_approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleVideoDecision(video.id, 'sp_rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
         {/* Transaction Status Overview */}
         <SPTransactionStatusList />
      </div>
    </Layout>
  );
};

export default SPTeamDashboard;
