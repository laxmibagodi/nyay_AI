
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

/**
 * Public routes that do not require authentication.
 * '/' is now the Landing Page (Welcome).
 */
const publicRoutes = ['/', '/sign-in', '/sign-up', '/verify', '/pricing'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user profile to check for onboarding status
  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocQuery);

  useEffect(() => {
    if (isUserLoading) return;

    // 1. Not logged in -> Redirect to Landing Page if trying to access protected route
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/');
      return;
    }

    // 2. Logged in logic
    if (user) {
      // If on a login page or the landing page but already logged in -> Go to Dashboard/Onboarding
      if (['/', '/sign-in', '/sign-up'].includes(pathname)) {
        if (!isUserDataLoading) {
           if (!userData || !userData.onboardingComplete) {
              router.push('/onboarding');
           } else {
              router.push('/dashboard');
           }
        }
        return;
      }

      // 3. Onboarding Check: If logged in but not onboarded -> Go to Onboarding
      if (!isUserDataLoading && pathname !== '/onboarding' && !publicRoutes.includes(pathname)) {
        if (!userData || !userData.onboardingComplete) {
          router.push('/onboarding');
        }
      }
    }
  }, [user, isUserLoading, pathname, router, userData, isUserDataLoading]);

  // Loading state for initial auth check or when user data is being fetched
  if (isUserLoading || (user && isUserDataLoading && pathname !== '/onboarding' && !publicRoutes.includes(pathname))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Securing Vault...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
