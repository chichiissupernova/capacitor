
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Calendar,
  Flame,
  StickyNote,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sparkles,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChallengeInviteButton } from "@/components/challenges/ChallengeInviteButton";

// Sidebar items
const sidebarItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Home className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: <Calendar className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    name: "Streaks",
    path: "/streaks",
    icon: <Flame className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    name: "Notes",
    path: "/notes",
    icon: <StickyNote className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    name: "Content Ideas",
    path: "/content-ideas",
    icon: <Sparkles className="h-[1.2rem] w-[1.2rem]" />,
  },
  {
    name: "Brand Vault",
    path: "/brand-vault",
    icon: <Star className="h-[1.2rem] w-[1.2rem]" />,
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

function Sidebar({
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  // Handle profile click to navigate to profile
  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Handle logo click to navigate to dashboard
  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const currentPath = location.pathname;

  return (
    <div className="h-full w-full flex flex-col border-r bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn(
          "flex items-center gap-2 font-semibold transition-opacity cursor-pointer hover:opacity-80",
          isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
        )} onClick={handleLogoClick}>
          <span className="text-chichi-orange text-lg">CHICHI</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onToggle(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navigation Items */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-1 py-2", isCollapsed ? "px-2" : "px-4")}>
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={currentPath === item.path ? "default" : "ghost"}
              className={cn(
                "flex items-center justify-start font-normal",
                currentPath === item.path ? "bg-chichi-orange hover:bg-chichi-orange/90 text-white" : "",
                isCollapsed ? "justify-center" : ""
              )}
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                {!isCollapsed && <span className="ml-2">{item.name}</span>}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      {/* Challenge Invite Button */}
      {!isCollapsed && (
        <div className="px-4 pb-2">
          <ChallengeInviteButton />
        </div>
      )}
      
      <Separator />
      
      {/* User Profile */}
      <div 
        className={cn(
          "p-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors", 
          isCollapsed ? "justify-center p-2" : "p-4"
        )}
        onClick={handleProfileClick}
      >
        <Avatar className={cn("h-8 w-8", isCollapsed ? "mx-auto" : "mr-2")}>
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 ml-2 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Logout Button */}
      <Button
        variant="ghost"
        className={cn(
          "my-2 flex items-center justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30",
          isCollapsed ? "mx-auto p-2" : "mx-4 px-4"
        )}
        onClick={handleLogout}
      >
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
        {!isCollapsed && <span className="ml-2">Logout</span>}
      </Button>
    </div>
  );
}

export default Sidebar;
