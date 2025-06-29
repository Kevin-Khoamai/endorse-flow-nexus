import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useVideos } from '@/hooks/useVideos';
import { useToast } from '@/hooks/use-toast';

const AdvertiserApprovalList = () => {
  const { toast } = useToast();
  const { applications, updateApplicationStatus } = useApplications();
  const { videos, updateVideoStatus } = useVideos();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalType, setApprovalType] = useState<'application' | 'video'>('application');
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter items that are SP approved and pending advertiser review
  const spApprovedApplications = applications.filter(app => app.status === 'sp_approved');
  const spApprovedVideos = videos.filter(video => video.status === 'sp_approved');

  const handleApproval = async (item: any, type: 'application' | 'video', decision: 'approve' | 'reject') => {
    const status = decision === 'approve' 
      ? 'advertiser_approved' 
      : 'advertiser_rejected';

    // Show popup for debugging
    /* alert(`About to update: applicationId=${item.id}, status=${status}`);
    console.log('Query: update campaign_applications set status =', status, 'where id =', item.id);
    */
   
    let result;
    if (type === 'application') {
      result = await updateApplicationStatus(item.id, status as any);
    } else {
      result = await updateVideoStatus(item.id, status as any);
    }

    if (result.error) {
      toast({
        title: "Error",
        description: `Failed to ${decision} ${type} ${result.error}. Please try again.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${decision === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The ${type} has been ${decision}d successfully. The publisher will be notified automatically.`,
    });

    setShowApprovalDialog(false);
    setSelectedItem(null);
    setRejectionReason('');
  };

  const openApprovalDialog = (item: any, type: 'application' | 'video') => {
    setSelectedItem(item);
    setApprovalType(type);
    setShowApprovalDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sp_approved': return 'bg-blue-100 text-blue-800';
      case 'advertiser_approved': return 'bg-green-100 text-green-800';
      case 'advertiser_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sp_approved': return <Clock className="w-4 h-4" />;
      case 'advertiser_approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'advertiser_rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Your Approval
            {(spApprovedApplications.length + spApprovedVideos.length > 0) && (
              <Badge variant="destructive" className="ml-2">
                {spApprovedApplications.length + spApprovedVideos.length} pending
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            Items approved by SP Team awaiting your final approval. Publishers will receive automatic notifications when you approve or reject items.
          </div>
          
          {spApprovedApplications.length === 0 && spApprovedVideos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No items pending your approval at the moment.
            </p>
          ) : (
            <div className="space-y-4">
              {/* SP Approved Applications */}
              {spApprovedApplications.map((application) => (
                <div key={`app-${application.id}`} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        Campaign Application
                      </Badge>
                      {getStatusIcon(application.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                      SP Approved: {application.sp_reviewed_at ? new Date(application.sp_reviewed_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="font-medium">{application.campaign?.title}</div>
                      <div className="text-sm text-gray-600">{application.campaign?.brand}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Publisher</div>
                      <div className="font-medium">{application.publisher?.full_name}</div>
                    </div>
                  </div>
                  
                  {application.message && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Application Message:</div>
                      <div className="text-sm bg-white p-3 rounded border">
                        {application.message}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproval(application, 'application', 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve & Notify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openApprovalDialog(application, 'application')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject & Notify
                    </Button>
                  </div>
                </div>
              ))}

              {/* SP Approved Videos */}
              {spApprovedVideos.map((video) => (
                <div key={`video-${video.id}`} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(video.status)}>
                        Video Submission
                      </Badge>
                      {getStatusIcon(video.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                      SP Approved: {video.sp_reviewed_at ? new Date(video.sp_reviewed_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="font-medium">{video.title}</div>
                      <div className="text-sm text-gray-600">{video.application?.campaign?.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Publisher</div>
                      <div className="font-medium">{video.application?.publisher?.full_name}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Video URL:</div>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      {video.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  
                  {video.description && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Description:</div>
                      <div className="text-sm bg-white p-3 rounded border">
                        {video.description}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproval(video, 'video', 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve & Notify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openApprovalDialog(video, 'video')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject & Notify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Reject {approvalType === 'application' ? 'Application' : 'Video'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Reason for rejection (optional)
              </label>
              <Textarea
                placeholder="Please provide feedback for the publisher..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                The publisher will receive an automatic notification about this rejection.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleApproval(selectedItem, approvalType, 'reject')}
                variant="destructive"
              >
                Confirm Rejection & Notify
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertiserApprovalList;
