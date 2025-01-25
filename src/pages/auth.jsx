import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/login";
import Signup from "@/components/signup";
import { UrlState } from "@/context";


const Auth = () => {
  const [SearchParams] = useSearchParams();
  const longLink = SearchParams.get("createNew");
  const navigate = useNavigate();

  const { isAuthenticated, loading } = UrlState();
  

  useEffect(() => {
    
    if (isAuthenticated) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading])
  

  return (
    <div className="mt-12 md:mt-24 flex flex-col items-center gap-6 md:gap-10 rounded px-4 md:px-0">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center">
        {longLink
          ? "Hold up! Lets's Login first"
          : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2 p-0 rounded-lg">
          <TabsTrigger 
            value="login" 
            className="rounded-r-none data-[state=active]:rounded-r-none text-sm md:text-base"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="rounded-l-none data-[state=active]:rounded-l-none text-sm md:text-base"
          >
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
          
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
