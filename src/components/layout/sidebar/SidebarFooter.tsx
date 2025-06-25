
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {/* User Profile */}
      <div 
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors mb-2 ${isCollapsed ? 'justify-center' : ''}`}
        onClick={handleProfileClick}
        title={isCollapsed ? `${user?.name || "User"}` : undefined}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        )}
      </div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? "Logout" : undefined}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
