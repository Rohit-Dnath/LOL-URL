import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UrlState } from "@/context";
import { getInviteByToken, acceptInvite } from "@/db/apiWorkspaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar, 
  Shield,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchWorkspaces, setCurrentWorkspace } = UrlState();
  
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadInvite();
  }, [token]);

  const loadInvite = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      console.log('Loading invite with token:', token);
      
      const inviteData = await getInviteByToken(token);
      console.log('Invite data loaded:', inviteData);
      setInvite(inviteData);

      // Check if expired
      if (new Date(inviteData.expires_at) < new Date()) {
        setError("This invite has expired");
      } else if (inviteData.status !== 'pending') {
        setError("This invite has already been used");
      }
    } catch (err) {
      console.error("Error loading invite:", err);
      setError(err.message || "Invalid or expired invite link");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!isAuthenticated) {
      // Store the invite token in localStorage to handle it after auth
      localStorage.setItem('pendingInviteToken', token);
      // Redirect to auth page
      navigate(`/auth?redirect=/invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      console.log('Accepting invite with user:', user.id);
      await acceptInvite(token, user.id);
      setSuccess(true);
      toast.success(`You've joined ${invite.workspaces.name}!`, toastConfig);
      
      // Refresh workspaces and switch to the new one
      await fetchWorkspaces();
      
      // Redirect to workspace settings after 2 seconds
      setTimeout(() => {
        navigate("/workspace-settings");
      }, 2000);
    } catch (err) {
      console.error("Error accepting invite:", err);
      setError(err.message || "Failed to join workspace");
      toast.error(err.message || "Failed to join workspace", toastConfig);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader color="hsl(var(--primary))" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md rounded-xl border-2 border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to the team!</h2>
              <p className="text-muted-foreground">
                You've successfully joined <span className="font-semibold text-foreground">{invite?.workspaces?.name}</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md rounded-xl border-2 border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Invalid Invite</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="rounded-xl"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg rounded-xl border-2 border-border shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            You've been invited!
          </CardTitle>
          <CardDescription className="text-base">
            Join <span className="font-semibold text-foreground">{invite?.workspaces?.name}</span> workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Workspace Details */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Workspace</span>
              </div>
              <span className="font-medium">{invite?.workspaces?.name}</span>
            </div>

            {invite?.workspaces?.description && (
              <div className="text-sm text-muted-foreground pt-2 border-t border-border/30">
                {invite.workspaces.description}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Your Role</span>
              </div>
              <span className="font-medium capitalize bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">
                {invite?.role}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Expires</span>
              </div>
              <span className="text-sm">
                {formatDistanceToNow(new Date(invite?.expires_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Role Permissions Info */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-500 mb-1">What you can do:</p>
                <ul className="text-muted-foreground space-y-1">
                  {invite?.role === 'admin' && (
                    <>
                      <li>• Create, edit, and delete links</li>
                      <li>• Invite and manage team members</li>
                      <li>• View all analytics</li>
                    </>
                  )}
                  {invite?.role === 'editor' && (
                    <>
                      <li>• Create and edit links</li>
                      <li>• View analytics</li>
                      <li>• Cannot manage team members</li>
                    </>
                  )}
                  {invite?.role === 'viewer' && (
                    <>
                      <li>• View all links and analytics</li>
                      <li>• Cannot create or edit links</li>
                      <li>• Read-only access</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAcceptInvite}
              disabled={accepting}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
              size="lg"
            >
              {accepting ? (
                <BeatLoader size={8} color="currentColor" />
              ) : isAuthenticated ? (
                "Accept Invitation"
              ) : (
                "Sign in to Accept"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full rounded-xl"
            >
              Decline
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-center text-muted-foreground">
              You'll need to sign in or create an account to join this workspace
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
