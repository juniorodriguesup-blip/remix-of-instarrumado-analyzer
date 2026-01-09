import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: some external redirects can incorrectly encode the query into the pathname
    // e.g. /area-vip%3Ftoken%3Dpremium2026
    const rawPath = `${location.pathname}${location.search}`;

    if (rawPath.includes("/area-vip%3Ftoken%3D") || location.pathname.includes("/area-vip?token=")) {
      const decoded = decodeURIComponent(rawPath);
      // Extract token from either decoded pathname or search
      const token = decoded.split("token=")[1]?.split("&")[0];
      if (token) {
        navigate(`/area-vip?token=${encodeURIComponent(token)}`, { replace: true });
        return;
      }
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      location.search
    );
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
