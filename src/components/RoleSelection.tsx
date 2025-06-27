
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const roles: Role[] = [
    {
      id: 'publisher',
      title: 'Publisher',
      description: 'Browse campaigns, apply for endorsements, and upload videos',
      icon: '🎥'
    },
    {
      id: 'sp-team',
      title: 'SP Team',
      description: 'Review applications, approve videos, and monitor campaigns',
      icon: '👥'
    },
    {
      id: 'advertiser',
      title: 'Advertiser',
      description: 'Create campaigns, review applications, and approve content',
      icon: '📢'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Endorsement Campaign Platform
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role to get started
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{role.icon}</div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">{role.description}</p>
                <Button className="w-full">
                  Enter Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
