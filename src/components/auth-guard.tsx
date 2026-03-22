
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/sign-in', '/sign-up', '/verify', '/pricing', '/welcome'];

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

    // 1. Not logged in -> Go to Welcome
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/welcome');
      return;
    }

    // 2. Logged in logic
    if (user) {
      // If on a login page but already logged in -> Check Onboarding
      if (['/sign-in', '/sign-up', '/welcome'].includes(pathname)) {
        if (!isUserDataLoading) {
           if (!userData || !userData.onboardingComplete) {
              router.push('/onboarding');
           } else {
              router.push('/');
           }
        }
        return;
      }

      // 3. Onboarding Check: If logged in but not onboarded -> Go to Onboarding
      // We check for !isUserDataLoading to ensure we have the most current data
      if (!isUserDataLoading && pathname !== '/onboarding' && !publicRoutes.includes(pathname)) {
        if (!userData || !userData.onboardingComplete) {
          router.push('/onboarding');
        }
      }
    }
  }, [user, isUserLoading, pathname, router, userData, isUserDataLoading]);

  // Loading state for initial auth check or when user is logging in
  if (isUserLoading || (user && isUserDataLoading && pathname !== '/onboarding')) {
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
