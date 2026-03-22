
'use client';

import { useEffect, useRef } from 'react';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';

/**
 * AuthInitializer component ensures that every visitor has a Firebase identity.
 * It initiates an anonymous sign-in if the user is not already authenticated.
 */
export function AuthInitializer() {
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();
  const { toast } = useToast();
  const hasAttempted = useRef(false);

  useEffect(() => {
    // If auth is initialized but we have no user and aren't currently loading,
    // initiate an anonymous sign-in.
    if (!isUserLoading && !user && auth && !hasAttempted.current) {
      hasAttempted.current = true;
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  useEffect(() => {
    if (userError) {
      toast({
        title: "Connection Error",
        description: "Could not establish a secure connection to the Legal Vault. Please ensure Anonymous Auth is enabled in your Firebase console.",
        variant: "destructive"
      });
    }
  }, [userError, toast]);

  return null;
}
