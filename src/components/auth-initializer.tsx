
'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

/**
 * AuthInitializer component ensures that every visitor has a Firebase identity.
 * It initiates an anonymous sign-in if the user is not already authenticated.
 */
export function AuthInitializer() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If auth is initialized but we have no user and aren't currently loading,
    // initiate an anonymous sign-in.
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  // This component is purely for logic and doesn't render anything.
  return null;
}
