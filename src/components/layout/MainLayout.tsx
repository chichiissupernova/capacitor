
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Navigate } from "react-router-dom";
import { SyncStatusIndicator } from "@/components/sync/SyncStatusIndicator";
import { FeedbackPopup } from "@/components/feedback/FeedbackPopup";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading only briefly during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, redirect to login
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // If we have a user, show the main app
  if (user) {
    return (
      <div 
        className="min-h-screen flex flex-col w-full"
        style={{
          backgroundImage: `url('/lovable-uploads/c2be135e-d651-4e90-87c9-e5c34f5cc301.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Header - Fixed at top without border */}
        <div 
          className="px-4 py-3 pt-safe sticky top-0"
          style={{ 
            zIndex: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-xl font-semibold">CHICHI</span>
            <div className="flex items-center space-x-2">
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-10 w-10 text-white hover:text-gray-300 touch-manipulation"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content - Added pb-20 for bottom nav spacing */}
        <main className="flex-1 px-3 py-4 md:p-6 overflow-x-hidden overflow-y-auto pb-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Sync Status */}
        <SyncStatusIndicator />
        
        {/* Feedback Popup */}
        <FeedbackPopup />
      </div>
    );
  }

  // Final fallback - should rarely reach here
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing...</p>
      </div>
    </div>
  );
}
