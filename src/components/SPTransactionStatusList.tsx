
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';

const SPTransactionStatusList = () => {
  const { applications, loading: applicationsLoading } = useApplications();
  const { videos, loading: videosLoading } = useVideos();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sp_approved': return 'bg-blue-100 text-blue-800';
      case 'sp_rejected': return 'bg-red-100 text-red-800';
      case 'advertiser_approved': return 'bg-green-100 text-green-800';
      case 'advertiser_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'sp_approved': return 50;
      case 'sp_rejected': return 100;
      case 'advertiser_approved': return 100;
      case 'advertiser_rejected': return 100;
      default: return 0;
    }
  };

  const getProgressSteps = (status: string, type: 'application' | 'video') => {
    const steps = type === 'application' 
      ? ['Submitted', 'SP Review', 'Advertiser Review', 'Complete']
      : ['Uploaded', 'SP Review', 'Advertiser Review', 'Complete'];
    
    let currentStep = 0;
    switch (status) {
      case 'pending': currentStep = 1; break;
      case 'sp_approved': currentStep = 2; break;
      case 'sp_rejected': 
      case 'advertiser_approved': 
      case 'advertiser_rejected': currentStep = 4; break;
      default: currentStep = 0;
    }

    return { steps, currentStep };
  };

  if (applicationsLoading || videosLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transaction Status & Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Campaign Applications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Campaign Applications</h3>
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Applied Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => {
                    const { steps, currentStep } = getProgressSteps(application.status, 'application');
                    const progressPercentage = getProgressPercentage(application.status);
                    
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.publisher?.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>{application.campaign?.title || 'N/A'}</TableCell>
                        <TableCell>{application.campaign?.brand || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(application.status)}>
                            {formatStatus(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-48">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Step {currentStep} of {steps.length}</span>
                              <span>{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="text-xs text-gray-500">
                              Current: {steps[currentStep - 1] || 'Not Started'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Video Submissions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Video Submissions</h3>
            {videos.length === 0 ? (
              <p className="text-gray-500 text-sm">No videos found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Video Title</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Video URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Upload Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => {
                    const { steps, currentStep } = getProgressSteps(video.status, 'video');
                    const progressPercentage = getProgressPercentage(video.status);
                    
                    return (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">
                          {video.application?.publisher?.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>{video.title}</TableCell>
                        <TableCell>
                          {video.application?.campaign?.title || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm max-w-xs truncate block"
                          >
                            {video.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(video.status)}>
                            {formatStatus(video.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-48">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Step {currentStep} of {steps.length}</span>
                              <span>{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="text-xs text-gray-500">
                              Current: {steps[currentStep - 1] || 'Not Started'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(video.uploaded_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SPTransactionStatusList;
