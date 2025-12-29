import { useEffect, useState } from 'react';
import supabase from '@/db/supabase';

/**
 * Client-side session hook using Supabase Auth
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            image: session.user.user_metadata?.avatar_url
          }
        });
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            image: session.user.user_metadata?.avatar_url
          }
        });
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, status, loading: status === 'loading' };
}

export async function signIn(provider = 'google', options = {}) {
  const redirectTo = options.callbackUrl || window.location.origin + '/dashboard';
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo
    }
  });

  if (error) {
    console.error('Sign in error:', error);
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}
