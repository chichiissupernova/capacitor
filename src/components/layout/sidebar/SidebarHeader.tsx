
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export function SidebarHeader({ isCollapsed, onToggle, onCollapse }: SidebarHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleDesktopToggle = () => {
    if (onCollapse) {
      onCollapse(!isCollapsed);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div 
        className={`flex items-center gap-2 font-semibold cursor-pointer hover:opacity-80 transition-opacity ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
        onClick={handleLogoClick}
      >
        <span className="text-white text-lg">CHICHI</span>
      </div>
      
      {/* Mobile close button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={onToggle}
      >
        <X className="h-5 w-5" />
      </Button>
      
      {/* Desktop collapse toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="hidden md:flex h-8 w-8"
        onClick={handleDesktopToggle}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
}
