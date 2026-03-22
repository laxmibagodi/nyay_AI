
'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, FileSearch, FilePlus2, MessageSquareQuote, ShieldCheck, ArrowRight, Files, Activity, Zap, ShieldAlert, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, query, collection, orderBy, limit } from "firebase/firestore"
import { format } from "date-fns"

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);

  const recentDocsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'documents'),
      orderBy('uploadDate', 'desc'),
      limit(3)
    );
  }, [db, user]);

  const { data: recentDocs } = useCollection(recentDocsQuery);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm md:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-black text-primary tracking-tighter">Nyaya AI</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Mobile Header */}
          <section className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-slate-800">
                नमस्ते {userData?.name?.split(' ')[0] || 'Dost'}! 👋
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal Status: Active</p>
            </div>
            <Link href="/profile">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
                <User className="h-6 w-6 text-slate-400" />
              </div>
            </Link>
          </section>

          {/* Primary Action Button */}
          <Link href="/risks" className="block">
            <Card className="accent-gradient border-none shadow-xl rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-40 w-40" />
              </div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <FileSearch className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black leading-tight">Contract Risk Scan</h2>
                  <p className="text-sm font-medium text-white/70">Check for 'traps' in your papers.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Usage</p>
              <div className="text-xl font-black">{userData?.scansUsed || 0} / 3</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Free Scans Used</p>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Plan</p>
              <div className="text-xl font-black uppercase text-emerald-600">FREE</div>
              <Link href="/pricing" className="text-[10px] text-primary font-bold mt-1 uppercase underline underline-offset-2">Upgrade to Pro</Link>
            </Card>
          </div>

          {/* Modules Grid */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-800">Legal Toolbox</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Jargon", icon: BookText, href: "/translator", color: "bg-blue-500" },
                { title: "Vault", icon: Files, href: "/documents", color: "bg-indigo-500" },
                { title: "Ask AI", icon: MessageSquareQuote, href: "/assistant", color: "bg-rose-500" },
                { title: "Draft", icon: FilePlus2, href: "/generator", color: "bg-emerald-500" },
              ].map((pill) => (
                <Link key={pill.title} href={pill.href}>
                  <Card className="h-28 border-none shadow-sm flex flex-col items-center justify-center gap-3 rounded-2xl active:scale-95 transition-transform">
                    <div className={`w-10 h-10 rounded-xl ${pill.color} flex items-center justify-center text-white shadow-lg`}>
                      <pill.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600">{pill.title}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Documents */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">Recent Vault</h3>
              <Link href="/documents" className="text-xs font-bold text-primary">View All</Link>
            </div>
            <div className="space-y-3">
              {recentDocs?.map((doc, idx) => (
                <Card key={idx} className="border-none shadow-sm p-4 flex items-center justify-between rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Files className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{doc.filename}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(doc.uploadDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-primary">View</Button>
                </Card>
              ))}
              {(!recentDocs || recentDocs.length === 0) && (
                <div className="py-10 text-center text-slate-300">
                  <Files className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-bold">Your vault is empty</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </SidebarInset>
    </div>
  )
}
