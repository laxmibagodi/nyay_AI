
'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * AuthInitializer component now primarily handles error reporting for the auth state.
 * Automatic anonymous sign-in has been disabled to support mandatory Real Auth (Email/Phone).
 */
export function AuthInitializer() {
  const { userError } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (userError) {
      toast({
        title: "Authentication Error",
        description: "Could not establish a secure connection. Please check your internet or refresh.",
        variant: "destructive"
      });
    }
  }, [userError, toast]);

  return null;
}
