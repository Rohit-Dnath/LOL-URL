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
    <div className="mt-24 flex flex-col items-center gap-10 rounded">
      <h1 className="text-5xl font-extrabold">
        {longLink
          ? "Hold up! Lets's Login first"
          : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 rounded">
          <TabsTrigger value="login" className="rounded">Login</TabsTrigger>
          <TabsTrigger value="signup" className="rounded">Signup</TabsTrigger>
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
