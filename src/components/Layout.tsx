
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import NotificationDropdown from './NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  headerAction?: React.ReactNode;
}

const Layout = ({ children, title, onBack, headerAction }: LayoutProps) => {
  const { userProfile, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="mr-4">
                  ← Back
                </Button>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {title || 'Campaign Platform'}
              </h1>
              {userProfile && (
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {userProfile.role === 'sp_team' ? 'SP Team' : 
                   userProfile.role === 'advertiser' ? 'Advertiser' : 'Publisher'}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {userProfile && (
                <>
                  <span className="text-sm text-gray-600">
                    {userProfile.full_name || userProfile.email}
                  </span>
                  {userProfile.role === 'publisher' && <NotificationDropdown />}
                  <Button variant="outline" onClick={handleSignOut}>
                    AASign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {headerAction && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {headerAction}
        </div>
      )}
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
