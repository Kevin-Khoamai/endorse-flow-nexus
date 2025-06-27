
import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  publisherName: string;
  campaignTitle: string;
  experience: string;
  audience: string;
  videoIdeas: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface VideoSubmission {
  id: string;
  publisherName: string;
  campaignTitle: string;
  videoTitle: string;
  videoUrl: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface SPTeamDashboardProps {
  onBack: () => void;
}

const SPTeamDashboard = ({ onBack }: SPTeamDashboardProps) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      publisherName: 'Sarah Johnson',
      campaignTitle: 'Summer Fashion Collection',
      experience: 'I have been creating fashion content for 3 years with consistent engagement...',
      audience: '15K followers, primarily women aged 18-35 interested in affordable fashion...',
      videoIdeas: 'Morning to night outfit transitions, styling tips for different body types...',
      status: 'pending',
      submittedAt: '2024-06-25'
    },
    {
      id: '2',
      publisherName: 'Mike Chen',
      campaignTitle: 'Tech Product Launch',
      experience: 'Tech reviewer with 5 years experience, specialized in mobile devices...',
      audience: '32K subscribers on YouTube, tech enthusiasts and early adopters...',
      videoIdeas: 'Unboxing, detailed feature walkthrough, comparison with competitors...',
      status: 'pending',
      submittedAt: '2024-06-24'
    }
  ]);

  const [videoSubmissions, setVideoSubmissions] = useState<VideoSubmission[]>([
    {
      id: '1',
      publisherName: 'Emma Wilson',
      campaignTitle: 'Fitness App Promotion',
      videoTitle: 'My 30-Day Fitness Journey with FitLife',
      videoUrl: 'https://youtube.com/watch?v=example1',
      description: 'Documented my complete workout journey using the FitLife app...',
      status: 'pending',
      submittedAt: '2024-06-23'
    }
  ]);

  const handleApplicationDecision = (applicationId: string, decision: 'approved' | 'rejected') => {
    setApplications(apps => 
      apps.map(app => 
        app.id === applicationId ? { ...app, status: decision } : app
      )
    );
    
    toast({
      title: decision === 'approved' ? "Application Approved" : "Application Rejected",
      description: `The application has been ${decision}.`,
    });
  };

  const handleVideoDecision = (videoId: string, decision: 'approved' | 'rejected') => {
    setVideoSubmissions(videos => 
      videos.map(video => 
        video.id === videoId ? { ...video, status: decision } : video
      )
    );
    
    toast({
      title: decision === 'approved' ? "Video Approved" : "Video Rejected",
      description: `The video has been ${decision}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="SP Team Dashboard" onBack={onBack}>
      <div className="space-y-8">
        {/* Applications Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Applications</h2>
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{application.publisherName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{application.campaignTitle}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Experience</h4>
                      <p className="text-sm text-gray-600">{application.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Audience</h4>
                      <p className="text-sm text-gray-600">{application.audience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Video Ideas</h4>
                      <p className="text-sm text-gray-600">{application.videoIdeas}</p>
                    </div>
                    {application.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApplicationDecision(application.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleApplicationDecision(application.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Submissions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Submissions</h2>
          <div className="space-y-4">
            {videoSubmissions.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{video.publisherName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{video.campaignTitle}</p>
                    </div>
                    <Badge className={getStatusColor(video.status)}>
                      {video.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Video Title</h4>
                      <p className="text-sm text-gray-600">{video.videoTitle}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Video URL</h4>
                      <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {video.videoUrl}
                      </a>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Description</h4>
                      <p className="text-sm text-gray-600">{video.description}</p>
                    </div>
                    {video.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleVideoDecision(video.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleVideoDecision(video.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SPTeamDashboard;
