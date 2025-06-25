
import { Link, useLocation } from "react-router-dom";
import { ChallengeInviteButton } from "@/components/challenges/ChallengeInviteButton";
import { menuItems } from "./menuItems";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarNavigation({ isCollapsed, onToggle }: SidebarNavigationProps) {
  const location = useLocation();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-chichi-orange text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              onClick={() => {
                // Close mobile sidebar when navigating
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Challenge Invite Button */}
      {!isCollapsed && (
        <div className="mt-6">
          <ChallengeInviteButton />
        </div>
      )}
    </div>
  );
}
