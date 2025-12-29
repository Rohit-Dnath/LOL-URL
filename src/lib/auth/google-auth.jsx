import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Gracefully handle missing client ID
  if (!googleClientId) {
    console.warn('⚠️ VITE_GOOGLE_CLIENT_ID not found. Add it to your .env file.');
    return <AuthStateProvider>{children}</AuthStateProvider>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthStateProvider>{children}</AuthStateProvider>
    </GoogleOAuthProvider>
  );
}

function AuthStateProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Check for stored session on mount
    const storedSession = localStorage.getItem('kliqin_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        // Check if token is expired
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setSession(parsed);
          setStatus('authenticated');
        } else {
          localStorage.removeItem('kliqin_session');
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('kliqin_session');
        setStatus('unauthenticated');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const signIn = (sessionData) => {
    try {
      setSession(sessionData);
      setStatus('authenticated');
      localStorage.setItem('kliqin_session', JSON.stringify(sessionData));
      return sessionData;
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  };

  const signOut = () => {
    setSession(null);
    setStatus('unauthenticated');
    localStorage.removeItem('kliqin_session');
  };

  return (
    <AuthContext.Provider value={{ session, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within AuthProvider');
  }
  return context;
}

export function useAuth() {
  return useSession();
}
