
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Star, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Calendar",
    path: "/calendar", 
    icon: Calendar,
  },
  {
    name: "Brand Vault",
    path: "/brand-vault",
    icon: Star,
  },
  {
    name: "Connect",
    path: "/creator-connect",
    icon: Users,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

function BottomNav() {
  const location = useLocation();

  console.log('BottomNav rendering, current path:', location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-200 shadow-lg z-50 grid grid-cols-5 safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center h-full relative touch-manipulation transition-colors duration-200",
              isActive 
                ? "text-chichi-orange font-semibold" 
                : "text-gray-600 hover:text-chichi-orange"
            )}
            aria-label={`Navigate to ${item.name}`}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-chichi-orange rounded-full" />
            )}
            
            <item.icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
            
            <span className="text-xs leading-none">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
