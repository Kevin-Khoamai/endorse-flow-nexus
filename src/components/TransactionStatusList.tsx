import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';
import { useNotifications } from '@/hooks/useNotifications';

const TransactionStatusList = () => {
  const { applications, loading: applicationsLoading } = useApplications();
  const { videos, loading: videosLoading } = useVideos();
  const { notifications } = useNotifications();

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

  if (applicationsLoading || videosLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status</CardTitle>
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
        <CardTitle>My Applications & Videos Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campaign Applications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Campaign Applications</h3>
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications submitted yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Rejection Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => {
                    // Find error notification for this application
                    const rejectionNotification = notifications.find(
                      n => n.related_id === application.id && n.type === 'error'
                    );
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.campaign?.title || 'N/A'}
                        </TableCell>
                        <TableCell>{application.campaign?.brand || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(application.status)}>
                            {formatStatus(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {rejectionNotification ? rejectionNotification.message : '-'}
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
            <h3 className="text-lg font-semibold mb-3">Video Submissions</h3>
            {videos.length === 0 ? (
              <p className="text-gray-500 text-sm">No videos uploaded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video Title</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Video URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
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
                      <TableCell>
                        {new Date(video.uploaded_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionStatusList;
