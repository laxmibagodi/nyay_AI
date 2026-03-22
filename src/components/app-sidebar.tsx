
"use client"

import * as React from "react"
import {
  BookText,
  FileSearch,
  FilePlus2,
  MessageSquareQuote,
  Files,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { t, Language } from "@/lib/translations"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const getNavItems = (lang: Language) => [
  {
    title: t(lang, 'dashboard'),
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: t(lang, 'translator'),
    url: "/translator",
    icon: BookText,
  },
  {
    title: t(lang, 'risks'),
    url: "/risks",
    icon: FileSearch,
  },
  {
    title: t(lang, 'generator'),
    url: "/generator",
    icon: FilePlus2,
  },
  {
    title: t(lang, 'assistant'),
    url: "/assistant",
    icon: MessageSquareQuote,
  },
  {
    title: t(lang, 'vault'),
    url: "/documents",
    icon: Files,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const db = useFirestore()

  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);
  const lang = (userData?.language || 'en') as Language;
  const navItems = getNavItems(lang);

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0 bg-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl accent-gradient text-white shadow-lg ring-4 ring-white/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-black text-xl text-white tracking-tight">Nyay AI</span>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Legal Fortress</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator className="bg-white/5 mx-4" />
      
      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={`h-11 rounded-xl transition-all duration-300 ${
                  pathname === item.url 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${pathname === item.url ? 'text-white' : 'text-inherit'}`} />
                  <span className="font-bold text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Fortress Integrity</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-black text-white">92%</span>
              <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[92%] bg-accent transition-all duration-1000" />
              </div>
            </div>
            <p className="mt-2 text-[9px] text-white/30 font-bold uppercase tracking-wider">Optimal Security Active</p>
          </div>
          
          <div className="flex flex-col gap-1 px-2">
            <Link href="#" className="flex items-center gap-3 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <Link href="#" className="flex items-center gap-3 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
              <HelpCircle className="h-4 w-4" /> Support
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
