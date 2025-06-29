
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '@/components/RoleSelection';
import PublisherDashboard from '@/components/PublisherDashboard';
import SPTeamDashboard from '@/components/SPTeamDashboard';
import AdvertiserDashboard from '@/components/AdvertiserDashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // Will redirect to auth
  }

  // If user has a role, automatically show their dashboard
  if (userProfile.role && !selectedRole) {
    if (userProfile.role === 'publisher') {
      return (
        <div>
          <div className="absolute top-4 right-4">

          </div>
          <PublisherDashboard onBack={handleBack} />
        </div>
      );
    }
    
    if (userProfile.role === 'sp_team') {
      return (
        <div>
          <div className="absolute top-4 right-4">
            
          </div>
          <SPTeamDashboard onBack={handleBack} />
        </div>
      );
    }
    
    if (userProfile.role === 'advertiser') {
      return (
        <div>
          <div className="absolute top-4 right-4">
           
          </div>
          <AdvertiserDashboard onBack={handleBack} />
        </div>
      );
    }
  }

  // Show role selection for manual override
  if (selectedRole === 'publisher') {
    return <PublisherDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'sp-team') {
    return <SPTeamDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'advertiser') {
    return <AdvertiserDashboard onBack={handleBack} />;
  }

  return (
    <div>
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <RoleSelection onRoleSelect={handleRoleSelect} />
    </div>
  );
};

export default Index;
