
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chichi-purple to-chichi-pink">
          404
        </div>
        <h1 className="text-4xl font-bold mb-4">Oops! Page not found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The content you're looking for doesn't seem to exist.
        </p>
        <Button asChild className="bg-chichi-purple hover:bg-chichi-purple-dark">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
