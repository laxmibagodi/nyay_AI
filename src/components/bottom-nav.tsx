
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Files, MessageSquareQuote, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { t, Language } from '@/lib/translations';

const getNavItems = (lang: Language) => [
  { label: t(lang, 'dashboard'), href: '/dashboard', icon: LayoutDashboard },
  { label: t(lang, 'vault'), href: '/documents', icon: Files },
  { label: t(lang, 'assistant'), href: '/assistant', icon: MessageSquareQuote },
  { label: t(lang, 'profile'), href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();

  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);
  const lang = (userData?.language || 'en') as Language;
  const navItems = getNavItems(lang);
  
  // Do not show bottom nav on auth or landing pages
  if (['/', '/sign-in', '/sign-up', '/verify', '/onboarding'].includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[4.5rem] bg-white border-t border-slate-100 flex items-center justify-around px-2 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              isActive ? "text-[#16a34a]" : "text-slate-400"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
