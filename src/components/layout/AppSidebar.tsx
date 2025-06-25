
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Flame,
  StickyNote,
  Star,
  Users,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChallengeInviteButton } from "@/components/challenges/ChallengeInviteButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Streaks",
    url: "/streaks",
    icon: Flame,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: StickyNote,
  },
  {
    title: "Content Plan",
    url: "/content-plan",
    icon: Calendar,
  },
  {
    title: "Brand Vault",
    url: "/brand-vault",
    icon: Star,
  },
  {
    title: "Creator Connect",
    url: "/creator-connect",
    icon: Users,
  },
  {
    title: "Following",
    url: "/following",
    icon: Heart,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // Get display name - prioritize name, fallback to username, then email
  const getDisplayName = () => {
    if (user?.name && user.name.trim()) {
      return user.name;
    }
    if (user?.username && user.username.trim()) {
      return `@${user.username}`;
    }
    return user?.email?.split('@')[0] || "User";
  };

  // Get secondary display info
  const getSecondaryInfo = () => {
    if (user?.name && user?.username) {
      return `@${user.username}`;
    }
    return user?.email;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div 
          className="flex items-center gap-2 font-semibold cursor-pointer hover:opacity-80 p-2"
          onClick={handleLogoClick}
        >
          <span className="text-chichi-orange text-lg">CHICHI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-[1.2rem] w-[1.2rem]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2">
              <ChallengeInviteButton />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        
        {/* User Profile */}
        <div 
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-sidebar-accent rounded-md transition-colors"
          onClick={handleProfileClick}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || ""} alt={getDisplayName()} />
            <AvatarFallback>
              {user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{getSecondaryInfo()}</p>
          </div>
        </div>
        
        <SidebarSeparator />
        
        {/* Logout Button */}
        <SidebarMenuButton
          onClick={handleLogout}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
        >
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
