import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-background border-2 border-border">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-xl">Page Error</CardTitle>
          <CardDescription>
            {error?.statusText || error?.message || 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="bg-muted/50 p-3 rounded-lg border border-border">
              <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-background rounded">
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
