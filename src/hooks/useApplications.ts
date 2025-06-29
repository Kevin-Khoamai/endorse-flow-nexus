
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CampaignApplication {
  id: string;
  campaign_id: string;
  publisher_id: string;
  status: 'pending' | 'sp_approved' | 'sp_rejected' | 'advertiser_approved' | 'advertiser_rejected';
  message: string | null;
  sp_reviewed_by: string | null;
  sp_reviewed_at: string | null;
  advertiser_reviewed_by: string | null;
  advertiser_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  campaign?: {
    title: string;
    brand: string;
  };
  publisher?: {
    full_name: string;
    email: string;
  };
}

export const useApplications = () => {
  const { userProfile } = useAuth();
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    if (!userProfile) return;

    try {
      let query = supabase
        .from('campaign_applications')
        .select(`
          *,
          campaign:campaigns(title, brand),
          publisher:profiles!campaign_applications_publisher_id_fkey(full_name, email)
        `);

      // Filter based on user role
      if (userProfile.role === 'publisher') {
        query = query.eq('publisher_id', userProfile.id);
      } else if (userProfile.role === 'advertiser') {
        query = query.eq('campaigns.created_by', userProfile.id);
      }
      // SP team sees all applications

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (campaignData: {
    campaign_id: string;
    experience: string;
    audience: string;
    videoIdeas: string;
  }) => {
    if (!userProfile) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('campaign_applications')
        .insert([{
          campaign_id: campaignData.campaign_id,
          publisher_id: userProfile.id,
          message: `Experience: ${campaignData.experience}\n\nAudience: ${campaignData.audience}\n\nVideo Ideas: ${campaignData.videoIdeas}`,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating application:', error);
        return { error };
      }

      setApplications(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating application:', error);
      return { error };
    }
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    status: 'sp_approved' | 'sp_rejected' | 'advertiser_approved' | 'advertiser_rejected'
  ) => {
    if (!userProfile) return { error: 'User not authenticated' };

    try {
      console.log('Updating application status:', { applicationId, status, userId: userProfile.id });
      
      const currentTime = new Date().toISOString();
      const updateData: any = {
        status: status,
        updated_at: currentTime
      };

      // Set the appropriate reviewer fields based on status
      if (status === 'sp_approved' || status === 'sp_rejected') {
        updateData.sp_reviewed_by = userProfile.id;
        updateData.sp_reviewed_at = currentTime;
      } else if (status === 'advertiser_approved' || status === 'advertiser_rejected') {
        updateData.advertiser_reviewed_by = userProfile.id;
        updateData.advertiser_reviewed_at = currentTime;
      }

      console.log('Update data being sent:', updateData);

      // Update the record in the database
      const { error: updateError } = await supabase
        .from('campaign_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (updateError) {
        console.error('Error updating application status:', updateError);
        return { error: updateError };
      }

      console.log('Database update successful, refreshing applications list...');

      // Refresh the entire applications list to get updated data
      await fetchApplications();

      console.log('Application updated successfully and list refreshed');
      return { data: null, error: null };
    } catch (error) {
      console.error('Error updating application:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchApplications();
    }
  }, [userProfile]);

  return {
    applications,
    loading,
    createApplication,
    updateApplicationStatus,
    refetch: fetchApplications
  };
};
