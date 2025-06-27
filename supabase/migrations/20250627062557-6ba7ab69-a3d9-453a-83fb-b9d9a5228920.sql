
-- Create enum types for better data consistency
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE application_status AS ENUM ('pending', 'sp_approved', 'sp_rejected', 'advertiser_approved', 'advertiser_rejected');
CREATE TYPE video_status AS ENUM ('pending', 'sp_approved', 'sp_rejected', 'advertiser_approved', 'advertiser_rejected');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'publisher' CHECK (role IN ('publisher', 'sp_team', 'advertiser')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT NOT NULL,
  deadline TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  status campaign_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign applications table
CREATE TABLE public.campaign_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  publisher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  message TEXT,
  sp_reviewed_by UUID REFERENCES public.profiles(id),
  sp_reviewed_at TIMESTAMP WITH TIME ZONE,
  advertiser_reviewed_by UUID REFERENCES public.profiles(id),
  advertiser_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, publisher_id)
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.campaign_applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  status video_status NOT NULL DEFAULT 'pending',
  sp_reviewed_by UUID REFERENCES public.profiles(id),
  sp_reviewed_at TIMESTAMP WITH TIME ZONE,
  advertiser_reviewed_by UUID REFERENCES public.profiles(id),
  advertiser_reviewed_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for campaigns
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Advertisers can manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "SP team can view all campaigns" ON public.campaigns FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sp_team')
);

-- Create RLS policies for campaign applications
CREATE POLICY "Publishers can view own applications" ON public.campaign_applications FOR SELECT USING (auth.uid() = publisher_id);
CREATE POLICY "Publishers can create applications" ON public.campaign_applications FOR INSERT WITH CHECK (auth.uid() = publisher_id);
CREATE POLICY "SP team can view all applications" ON public.campaign_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sp_team')
);
CREATE POLICY "Advertisers can view applications for their campaigns" ON public.campaign_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND created_by = auth.uid())
);

-- Create RLS policies for videos
CREATE POLICY "Publishers can manage own videos" ON public.videos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.campaign_applications WHERE id = application_id AND publisher_id = auth.uid())
);
CREATE POLICY "SP team can view all videos" ON public.videos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sp_team')
);
CREATE POLICY "Advertisers can view videos for their campaigns" ON public.videos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.campaign_applications ca
    JOIN public.campaigns c ON ca.campaign_id = c.id
    WHERE ca.id = application_id AND c.created_by = auth.uid()
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
