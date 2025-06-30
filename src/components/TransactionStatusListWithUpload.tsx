
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';

interface TransactionStatusListWithUploadProps {
  onUploadVideo: (applicationId: string) => void;
}

const TransactionStatusListWithUpload = ({ onUploadVideo }: TransactionStatusListWithUploadProps) => {
  const { applications } = useApplications();
  const { videos } = useVideos();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sp_approved': return 'bg-blue-100 text-blue-800';
      case 'sp_rejected': return 'bg-red-100 text-red-800';
      case 'advertiser_approved': return 'bg-green-100 text-green-800';
      case 'advertiser_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
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

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending SP Review';
      case 'sp_approved': return 'SP Approved - Pending Advertiser';
      case 'sp_rejected': return 'SP Rejected';
      case 'advertiser_approved': return 'Approved - Ready for Video';
      case 'advertiser_rejected': return 'Advertiser Rejected';
      default: return status;
    }
  };

  // Check if a video has been uploaded for this application
  const hasVideoUploaded = (applicationId: string) => {
    return videos.some(video => video.application_id === applicationId);
  };

  // Show upload button for advertiser_approved applications that don't have videos yet
  const showUploadButton = (app: any) => {
    return app.status === 'advertiser_approved' && !hasVideoUploaded(app.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Your Application Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No applications submitted yet. Browse campaigns below to get started!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.campaign?.title || 'Unknown Campaign'}
                    </TableCell>
                    <TableCell>{app.campaign?.brand || 'Unknown Brand'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(app.status)}>
                          {formatStatus(app.status)}
                        </Badge>
                        {getStatusIcon(app.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {showUploadButton(app) ? (
                        <Button 
                          size="sm" 
                          onClick={() => onUploadVideo(app.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload Video
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {hasVideoUploaded(app.id) ? 'Video Uploaded' : 'Not Ready'}
                        </span>
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
  );
};

export default TransactionStatusListWithUpload;
