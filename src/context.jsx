import {createContext, useContext, useEffect} from "react";
import {getCurrentUser} from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";
import supabase from "./db/supabase";

const UrlContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  fetchUser: () => {}
});

const UrlProvider = ({children}) => {
  const {data: user, loading, fn: fetchUser} = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();

    // Listen for auth state changes (OAuth callbacks)
    const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Update user metadata with Google profile picture if not set
        if (session?.user && !session.user.user_metadata?.profile_pic) {
          const googlePicture = session.user.user_metadata?.avatar_url || 
                               session.user.user_metadata?.picture;
          const googleName = session.user.user_metadata?.full_name || 
                            session.user.user_metadata?.name ||
                            session.user.email?.split('@')[0];
          
          if (googlePicture) {
            await supabase.auth.updateUser({
              data: {
                profile_pic: googlePicture,
                name: googleName
              }
            });
          }
        }
        fetchUser();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UrlContext.Provider value={{user, fetchUser, loading, isAuthenticated}}>
      {children}
    </UrlContext.Provider> 
  );
};

export const UrlState = () => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('UrlState must be used within a UrlProvider');
  }
  return context;
};

export default UrlProvider;