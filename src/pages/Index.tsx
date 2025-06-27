
import React, { useState } from 'react';
import RoleSelection from '@/components/RoleSelection';
import PublisherDashboard from '@/components/PublisherDashboard';
import SPTeamDashboard from '@/components/SPTeamDashboard';
import AdvertiserDashboard from '@/components/AdvertiserDashboard';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole === 'publisher') {
    return <PublisherDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'sp-team') {
    return <SPTeamDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'advertiser') {
    return <AdvertiserDashboard onBack={handleBack} />;
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
