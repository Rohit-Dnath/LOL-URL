import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, AlertCircle } from "lucide-react";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats().then(() => {
        setTimeout(() => {
          window.location.href = data.original_url;
        }, 100); // Reduced delay to 0.1 seconds
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background border-2 border-border shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            {/* Loading Bar */}
            <div className="w-full">
              <BarLoader width={"100%"} color="hsl(var(--primary))" height={4} />
            </div>
            
            {/* Status Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Redirecting</h2>
              <p className="text-sm text-muted-foreground">Please wait while we redirect you to your destination</p>
            </div>
            
            {/* Animated Illustration */}
            <div className="flex justify-center">
              <DotLottieReact
                src="https://lottie.host/bd7e9ba4-29f2-4660-8549-c28f74fcdb94/beN4xnKRlb.lottie"
                loop
                autoplay
                style={{
                  width: '200px',
                  height: '200px',
                }}
              />
            </div>
            
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Processing</span>
                <span>Almost there...</span>
              </div>
              <div className="w-full bg-muted h-2 overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-background border-2 border-border shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>
            
            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">404</h1>
              <h2 className="text-xl font-semibold text-foreground">Link Not Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                The URL you&apos;re looking for doesn&apos;t exist or has been removed. Please check the link and try again.
              </p>
            </div>
            
            {/* Error Illustration */}
            <div className="flex justify-center py-4">
              <img 
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnV3ZHVtZXhzb3N2ODNybDhicThzNHh1MW9xYWQ5eG5vejgyazY3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C21GGDOpKT6Z4VuXyn/giphy.gif" 
                alt="Not Found" 
                className="w-48 h-48 object-contain opacity-80" 
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="default" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Go Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 border-border hover:bg-muted"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Go Back
              </Button>
            </div>
            
            {/* Additional Info */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                If you believe this is an error, please contact support or try creating a new link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default RedirectLink;