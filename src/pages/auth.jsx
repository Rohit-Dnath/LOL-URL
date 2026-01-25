import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "@/components/login";
import { UrlState } from "@/context";


const Auth = () => {
  const [SearchParams] = useSearchParams();
  const longLink = SearchParams.get("createNew");
  const navigate = useNavigate();

  const { isAuthenticated, loading, fetchUser } = UrlState();
  

  useEffect(() => {
    // Check for OAuth callback tokens in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // OAuth callback detected, refresh user state
      console.log('OAuth callback detected, fetching user...');
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading])
  

  return (
    <div className="mt-12 md:mt-24 flex flex-col items-center gap-6 md:gap-10 rounded px-4 md:px-0">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center">
        {longLink
          ? "Hold up! Let's Login first"
          : "Welcome to LOL URL"}
      </h1>
      <div className="w-full max-w-[400px]">
        <Login />
      </div>
    </div>
  );
};

export default Auth;
