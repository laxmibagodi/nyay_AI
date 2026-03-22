
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Files, MessageSquareQuote, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'Vault', href: '/documents', icon: Files },
  { label: 'Ask', href: '/assistant', icon: MessageSquareQuote },
  { label: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  
  if (['/sign-in', '/sign-up', '/verify', '/onboarding'].includes(pathname)) return null;

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
