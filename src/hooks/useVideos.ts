
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VideoSubmission {
  id: string;
  application_id: string;
  title: string;
  url: string;
  description: string | null;
  status: 'pending' | 'sp_approved' | 'sp_rejected' | 'advertiser_approved' | 'advertiser_rejected';
  sp_reviewed_by: string | null;
  sp_reviewed_at: string | null;
  advertiser_reviewed_by: string | null;
  advertiser_reviewed_at: string | null;
  uploaded_at: string;
  application?: {
    campaign: {
      title: string;
      brand: string;
    };
    publisher: {
      full_name: string;
      email: string;
    };
  };
}

export const useVideos = () => {
  const { userProfile } = useAuth();
  const [videos, setVideos] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    if (!userProfile) return;

    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          application:campaign_applications(
            campaign:campaigns(title, brand),
            publisher:profiles!campaign_applications_publisher_id_fkey(full_name, email)
          )
        `);

      // Filter based on user role
      if (userProfile.role === 'publisher') {
        query = query.eq('campaign_applications.publisher_id', userProfile.id);
      } else if (userProfile.role === 'advertiser') {
        query = query.eq('campaign_applications.campaigns.created_by', userProfile.id);
      }
      // SP team sees all videos

      const { data, error } = await query.order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (videoData: {
    application_id: string;
    title: string;
    url: string;
    description?: string;
  }) => {
    if (!userProfile) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          application_id: videoData.application_id,
          title: videoData.title,
          url: videoData.url,
          description: videoData.description || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating video:', error);
        return { error };
      }

      setVideos(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating video:', error);
      return { error };
    }
  };

  const updateVideoStatus = async (
    videoId: string, 
    status: 'sp_approved' | 'sp_rejected' | 'advertiser_approved' | 'advertiser_rejected'
  ) => {
    if (!userProfile) return { error: 'User not authenticated' };

    try {
      console.log('Updating video:', videoId, 'to status:', status);
      
      const updateData: any = { status };

      if (status.startsWith('sp_')) {
        updateData.sp_reviewed_by = userProfile.id;
        updateData.sp_reviewed_at = new Date().toISOString();
      } else if (status.startsWith('advertiser_')) {
        updateData.advertiser_reviewed_by = userProfile.id;
        updateData.advertiser_reviewed_at = new Date().toISOString();
      }

      // First, update the record
      const { error: updateError } = await supabase
        .from('videos')
        .update(updateData)
        .eq('id', videoId);

      if (updateError) {
        console.error('Error updating video:', updateError);
        return { error: updateError };
      }

      // Refresh the entire videos list to get updated data
      await fetchVideos();

      console.log('Video updated successfully and list refreshed');
      return { data: null, error: null };
    } catch (error) {
      console.error('Error updating video:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchVideos();
    }
  }, [userProfile]);

  return {
    videos,
    loading,
    createVideo,
    updateVideoStatus,
    refetch: fetchVideos
  };
};
