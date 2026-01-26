import {createContext, useContext, useEffect, useState} from "react";
import {getCurrentUser} from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";
import supabase from "./db/supabase";
import {getUserWorkspaces} from "./db/apiWorkspaces";
import {subscribeToNotifications, unsubscribeFromNotifications, getUnreadCount} from "./db/apiNotifications";

const UrlContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  fetchUser: () => {},
  workspaces: [],
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
  fetchWorkspaces: () => {},
  notifications: [],
  unreadCount: 0,
  fetchNotifications: () => {}
});

const UrlProvider = ({children}) => {
  const {data: user, loading, fn: fetchUser} = useFetch(getCurrentUser);
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem('currentWorkspace');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAuthenticated = user?.role === "authenticated";

  // Persist workspace to localStorage
  const handleSetCurrentWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    if (workspace) {
      localStorage.setItem('currentWorkspace', JSON.stringify(workspace));
    } else {
      localStorage.removeItem('currentWorkspace');
    }
  };

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    if (user?.id) {
      try {
        const data = await getUserWorkspaces(user.id);
        setWorkspaces(data || []);
        
        // Validate saved workspace still exists
        if (currentWorkspace) {
          const stillExists = data?.find(w => w.id === currentWorkspace.id);
          if (!stillExists) {
            handleSetCurrentWorkspace(null);
          }
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    }
  };

  // Fetch unread notification count
  const fetchNotificationCount = async () => {
    if (user?.id) {
      try {
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    }
  };

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

  // Fetch workspaces when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
      fetchNotificationCount();
    }
  }, [isAuthenticated, user?.id]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (user?.id) {
      const subscription = subscribeToNotifications(user.id, (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        unsubscribeFromNotifications(subscription);
      };
    }
  }, [user?.id]);

  return (
    <UrlContext.Provider value={{
      user, 
      fetchUser, 
      loading, 
      isAuthenticated,
      workspaces,
      currentWorkspace,
      setCurrentWorkspace: handleSetCurrentWorkspace,
      fetchWorkspaces,
      notifications,
      unreadCount,
      fetchNotifications: fetchNotificationCount
    }}>
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