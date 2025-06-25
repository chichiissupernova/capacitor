
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

interface NewSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function NewSidebar({ isOpen, onToggle, isCollapsed = false, onCollapse }: NewSidebarProps) {
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full ${sidebarWidth} bg-white border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto
      `}>
        <SidebarHeader 
          isCollapsed={isCollapsed} 
          onToggle={onToggle} 
          onCollapse={onCollapse} 
        />
        
        <SidebarNavigation 
          isCollapsed={isCollapsed} 
          onToggle={onToggle} 
        />
        
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </>
  );
}
