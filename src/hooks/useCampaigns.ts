
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Campaign {
  id: string;
  title: string;
  brand: string;
  description: string;
  budget: string;
  deadline: string;
  requirements: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const { userProfile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      let query = supabase.from('campaigns').select('*');
      
      // If user is advertiser, show only their campaigns
      // If user is SP team, show all campaigns
      // If user is publisher, show only active campaigns
      if (userProfile?.role === 'advertiser') {
        query = query.eq('created_by', userProfile.id);
      } else if (userProfile?.role === 'publisher') {
        query = query.eq('status', 'active');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }
      
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!userProfile) return { error: 'User not authenticated' };
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          created_by: userProfile.id,
          status: 'active'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating campaign:', error);
        return { error };
      }
      
      setCampaigns(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchCampaigns();
    }
  }, [userProfile]);

  return {
    campaigns,
    loading,
    createCampaign,
    refetch: fetchCampaigns
  };
};
