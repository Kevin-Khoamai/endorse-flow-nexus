
import React, { useState } from 'react';
import Layout from './Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Plus } from 'lucide-react';
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
  applicants: number;
  videos: number;
}

interface AdvertiserDashboardProps {
  onBack: () => void;
}

const AdvertiserDashboard = ({ onBack }: AdvertiserDashboardProps) => {
  const { toast } = useToast();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Summer Fashion Collection',
      brand: 'TrendyWear',
      budget: '$500-$1,500',
      deadline: '2024-07-15',
      requirements: ['Fashion', '10K+ followers', 'Video content'],
      status: 'active',
      description: 'Promote our latest summer collection with authentic styling videos',
      applicants: 8,
      videos: 3
    },
    {
      id: '2',
      title: 'Tech Product Launch',
      brand: 'InnovateTech',
      budget: '$1,000-$3,000',
      deadline: '2024-07-30',
      requirements: ['Technology', '25K+ followers', 'Product reviews'],
      status: 'active',
      description: 'Create engaging reviews for our new smartphone launch',
      applicants: 12,
      videos: 1
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    brand: '',
    budget: '',
    deadline: '',
    description: '',
    requirements: ''
  });

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      title: newCampaign.title,
      brand: newCampaign.brand,
      budget: newCampaign.budget,
      deadline: newCampaign.deadline,
      description: newCampaign.description,
      requirements: newCampaign.requirements.split(',').map(req => req.trim()),
      status: 'active',
      applicants: 0,
      videos: 0
    };

    setCampaigns([...campaigns, campaign]);
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-sm text-gray-600">Active Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {campaigns.reduce((sum, c) => sum + c.applicants, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Applicants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + c.videos, 0)}
              </div>
              <p className="text-sm text-gray-600">Videos Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {campaigns.filter(c => c.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Campaigns</h2>
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
                      <p className="font-medium">{campaign.budget}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Deadline:</span>
                      <p className="font-medium">{campaign.deadline}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Applicants:</span>
                      <p className="font-medium">{campaign.applicants}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Videos:</span>
                      <p className="font-medium">{campaign.videos}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Applications
                    </Button>
                    <Button variant="outline" size="sm">
                      Review Videos
                    </Button>
                    <Button variant="outline" size="sm">
                      Campaign Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <label className="block text-sm font-medium mb-2">Campaign Title</label>
              <Input
                placeholder="Enter campaign title..."
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
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
              <label className="block text-sm font-medium mb-2">Description</label>
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
    </Layout>
  );
};

export default AdvertiserDashboard;
