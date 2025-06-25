
import React from 'react';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { UsernameSettings } from '@/components/profile/UsernameSettings';
import { CreatorConnectSettings } from '@/components/profile/CreatorConnectSettings';
import { NicheSettings } from '@/components/profile/NicheSettings';
import { ConnectedCreators } from '@/components/profile/ConnectedCreators';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6 pb-20 md:pb-6">
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 px-1 md:px-0">Profile Settings</h1>
      
      {/* Simple vertical stack - no horizontal grid */}
      <div className="space-y-3 md:space-y-6">
        <ProfileSettings />
        <UsernameSettings />
        <NicheSettings />
        <CreatorConnectSettings />
        <ConnectedCreators />
      </div>
    </div>
  );
}
