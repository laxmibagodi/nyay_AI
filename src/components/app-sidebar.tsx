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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Jargon Translator",
    url: "/translator",
    icon: BookText,
  },
  {
    title: "Risk Identifier",
    url: "/risks",
    icon: FileSearch,
  },
  {
    title: "Document Generator",
    url: "/generator",
    icon: FilePlus2,
  },
  {
    title: "Legal Assistant",
    url: "/assistant",
    icon: MessageSquareQuote,
  },
  {
    title: "My Documents",
    url: "/documents",
    icon: Files,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 group-data-[collapsible=icon]:justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span className="font-headline font-bold text-lg text-sidebar-foreground">Nyay AI</span>
          <span className="text-xs text-sidebar-foreground/60">Legal Shield</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="transition-all duration-200"
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-xl bg-sidebar-accent/50 p-4">
          <p className="text-xs font-medium text-sidebar-foreground">Compliance Guard</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full w-[85%] bg-accent transition-all duration-500" />
          </div>
          <p className="mt-2 text-[10px] text-sidebar-foreground/60 uppercase tracking-wider font-bold">85% Secured</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}