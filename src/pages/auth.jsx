import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { useSession } from "@/lib/auth/google-auth.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { session, status, signIn } = useSession();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (status === "authenticated" && session) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [status, session, navigate, longLink]);

  if (status === "loading") {
    return (
      <div className="mt-24 flex flex-col items-center gap-4">
        <BarLoader width="100%" color="hsl(var(--primary))" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Only call useGoogleLogin if client ID is available
  const handleGoogleSignIn = googleClientId ? useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();

        // Create session with user info
        const sessionData = {
          user: {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            image: userInfo.picture,
          },
          accessToken: tokenResponse.access_token,
          expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
        };

        signIn(sessionData);
        navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
      } catch (error) {
        console.error('Failed to get user info:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error)
  }) : null;

  return (
    <div className="mt-16 md:mt-24 flex flex-col items-center gap-8 md:gap-10 px-4 md:px-0">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
          {longLink
            ? "Hold up! Let's Login first"
            : "Welcome to KliqIN"}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
          {longLink
            ? "Sign in to shorten your URL and unlock powerful analytics"
            : "The smart way to shorten, share, and track your links"}
        </p>
      </div>

      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-base">
            Use your Google account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Button
            onClick={() => handleGoogleSignIn && handleGoogleSignIn()}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2"
            disabled={!googleClientId}
            title={!googleClientId ? 'Google OAuth not configured. Set VITE_GOOGLE_CLIENT_ID in .env' : undefined}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Continue with Google
          </Button>

          {!googleClientId && (
            <div className="text-xs text-center p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold mb-1">⚠️ Google OAuth Not Configured</p>
              <p className="text-muted-foreground">Add VITE_GOOGLE_CLIENT_ID to your .env file</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Secure authentication
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>

      <div className="text-center max-w-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-semibold">Unlimited Links</span>
            <span className="text-xs text-muted-foreground">Create as many short links as you need</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-semibold">Real-Time Analytics</span>
            <span className="text-xs text-muted-foreground">Track every click with detailed insights</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold">Team Workspaces</span>
            <span className="text-xs text-muted-foreground">Collaborate with your team effortlessly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
