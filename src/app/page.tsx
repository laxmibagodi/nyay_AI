
'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, FileSearch, FilePlus2, MessageSquareQuote, ShieldCheck, ArrowRight, Files, Activity, Zap, ShieldAlert, Sparkles, User, BarChart3, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, query, collection, orderBy, limit } from "firebase/firestore"
import { format } from "date-fns"
import { t, Language } from "@/lib/translations"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);
  const lang = (userData?.language || 'en') as Language;

  const recentDocsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'documents'),
      orderBy('uploadDate', 'desc'),
      limit(3)
    );
  }, [db, user]);

  const { data: recentDocs } = useCollection(recentDocsQuery);

  // Mock data for Activity Heatmap
  const activityData = [
    { day: 'Mon', count: 4, risk: 20 },
    { day: 'Tue', count: 7, risk: 45 },
    { day: 'Wed', count: 2, risk: 10 },
    { day: 'Thu', count: 12, risk: 80 },
    { day: 'Fri', count: 5, risk: 30 },
    { day: 'Sat', count: 3, risk: 15 },
    { day: 'Sun', count: 1, risk: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50 pb-24 md:pb-0">
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
          <section className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-slate-800">
                {t(lang, 'welcome')} {userData?.name?.split(' ')[0] || 'Dost'}! 👋
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Status: Active</p>
            </div>
            <Link href="/profile">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm hover:border-accent transition-colors">
                <User className="h-6 w-6 text-slate-400" />
              </div>
            </Link>
          </section>

          <Link href="/risks" className="block">
            <Card className="accent-gradient border-none shadow-xl rounded-3xl p-6 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <ShieldAlert className="h-40 w-40" />
              </div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <FileSearch className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black leading-tight">{t(lang, 'scanNow')}</h2>
                  <p className="text-sm font-medium text-white/70">{t(lang, 'checkTraps')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm rounded-2xl p-4 bg-white ring-1 ring-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t(lang, 'usage')}</p>
              <div className="text-xl font-black">{userData?.scansUsed || 0} / 50</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{t(lang, 'freeScans')}</p>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl p-4 bg-white ring-1 ring-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t(lang, 'plan')}</p>
              <div className="text-xl font-black uppercase text-emerald-600">FREE</div>
              <Link href="/pricing" className="text-[10px] text-primary font-bold mt-1 uppercase underline underline-offset-2 hover:text-accent transition-colors">{t(lang, 'upgrade')}</Link>
            </Card>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm rounded-3xl p-6 bg-white ring-1 ring-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{t(lang, 'activity')}</h3>
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={20}>
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#5e27ea' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl p-6 bg-white ring-1 ring-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <LayoutGrid className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{t(lang, 'riskHeatmap')}</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = Math.random();
                  const color = intensity > 0.8 ? 'bg-red-500' : intensity > 0.5 ? 'bg-amber-400' : intensity > 0.2 ? 'bg-emerald-400' : 'bg-slate-100';
                  return (
                    <div key={i} className={`aspect-square rounded-sm ${color} opacity-80 hover:scale-110 transition-transform cursor-help`} title={`Day ${i+1}: Risk Index ${Math.floor(intensity * 100)}`} />
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Low</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-100" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <span>High</span>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-800">{t(lang, 'toolbox')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: t(lang, 'translator'), icon: BookText, href: "/translator", color: "bg-blue-500" },
                { title: t(lang, 'vault'), icon: Files, href: "/documents", color: "bg-indigo-500" },
                { title: t(lang, 'assistant'), icon: MessageSquareQuote, href: "/assistant", color: "bg-rose-500" },
                { title: t(lang, 'generator'), icon: FilePlus2, href: "/generator", color: "bg-emerald-500" },
              ].map((pill) => (
                <Link key={pill.title} href={pill.href}>
                  <Card className="h-28 border-none shadow-sm flex flex-col items-center justify-center gap-3 rounded-2xl active:scale-95 transition-transform bg-white ring-1 ring-slate-100 hover:shadow-md">
                    <div className={`w-10 h-10 rounded-xl ${pill.color} flex items-center justify-center text-white shadow-lg`}>
                      <pill.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{pill.title}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{t(lang, 'recentVault')}</h3>
              <Link href="/documents" className="text-xs font-bold text-primary hover:text-accent">{t(lang, 'viewAll')}</Link>
            </div>
            <div className="space-y-3">
              {recentDocs?.map((doc, idx) => (
                <Card key={idx} className="border-none shadow-sm p-4 flex items-center justify-between rounded-2xl bg-white ring-1 ring-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Files className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{doc.filename}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(doc.uploadDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-primary hover:text-accent hover:bg-slate-50">View</Button>
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
