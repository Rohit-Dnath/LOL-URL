import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@/lib/auth/session";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth");
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BarLoader width="100%" color="hsl(var(--primary))" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated" && session) {
    return children;
  }

  return null;
}

export default RequireAuth;