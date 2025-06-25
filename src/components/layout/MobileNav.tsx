
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Home, Calendar, Flame, StickyNote, LogOut, Sparkles, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserPointsDisplay } from '@/components/dashboard/UserPointsDisplay';

// Sidebar items - same as in Sidebar component
const navItems = [
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

export function MobileNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  
  const currentPath = location.pathname;
  
  const handleLogout = React.useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);
  
  const handleProfileClick = React.useCallback(() => {
    setOpen(false);
    navigate("/profile");
  }, [navigate]);
  
  // Close sheet when route changes
  React.useEffect(() => {
    setOpen(false);
  }, [currentPath]);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 md:hidden">
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 p-0 touch-manipulation"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <span className="text-chichi-orange text-xl font-semibold">CHICHI</span>
      </div>
      
      <SheetContent side="left" className="w-[85%] sm:w-64 p-0 overflow-hidden">
        <div className="flex h-full w-full flex-col">
          {/* Header with logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b bg-white">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-chichi-orange text-lg">CHICHI</span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 overflow-auto p-2 scrollbar-hide">
            <div className="flex flex-col gap-1 py-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={currentPath === item.path ? "default" : "ghost"}
                  className={cn(
                    "flex justify-start font-normal w-full touch-manipulation min-h-[48px]",
                    currentPath === item.path ? "bg-chichi-purple hover:bg-chichi-purple/90 text-white" : ""
                  )}
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            {/* Points display */}
            <div className="mb-4 px-2">
              <UserPointsDisplay />
            </div>
          </div>
          
          {/* User profile & logout */}
          <div className="border-t bg-white">
            <div 
              className="p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation min-h-[64px]"
              onClick={handleProfileClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProfileClick();
                }
              }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || "User"} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full p-4 flex items-center justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 touch-manipulation min-h-[56px]"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
