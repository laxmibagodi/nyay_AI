
'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  LogOut, 
  ShieldCheck, 
  TrendingUp,
  ChevronRight,
  Zap
} from "lucide-react"
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { t, Language } from "@/lib/translations"

const languagesMap: Record<string, string> = {
  hi: "हिंदी",
  en: "English",
  kn: "ಕನ್ನಡ",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
};

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);
  const lang = (userData?.language || 'en') as Language;

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/welcome');
  };

  const scanProgress = ((userData?.scansUsed || 0) / 50) * 100;
  const chatProgress = ((userData?.questionsUsed || 0) / 10) * 100;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-black text-primary">{t(lang, 'profile')}</h1>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
          <section className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl premium-gradient flex items-center justify-center text-white shadow-2xl relative">
              <User className="h-12 w-12" />
              {userData?.plan === 'pro' && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm">
                  PRO
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{userData?.name || 'Nyay User'}</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{userData?.businessType || 'Small Business Owner'}</p>
            </div>
          </section>

          <Card className="border-none shadow-xl rounded-3xl overflow-hidden ring-1 ring-slate-100 bg-white">
            <div className={`h-2 w-full ${userData?.plan === 'pro' ? 'accent-gradient' : 'bg-slate-200'}`} />
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-black text-slate-800">{t(lang, 'plan')}</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Manage your subscription</CardDescription>
                </div>
                <Badge className={`${userData?.plan === 'pro' ? 'bg-accent' : 'bg-slate-500'} text-white border-none font-black`}>
                  {userData?.plan?.toUpperCase() || 'FREE'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase text-slate-500">
                    <span>{t(lang, 'freeScans')}</span>
                    <span>{userData?.scansUsed || 0} / 50</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase text-slate-500">
                    <span>AI Chat Questions</span>
                    <span>{userData?.questionsUsed || 0} / 10</span>
                  </div>
                  <Progress value={chatProgress} className="h-2" />
                </div>
              </div>
              
              {userData?.plan !== 'pro' && (
                <Button className="w-full h-14 accent-gradient rounded-2xl font-black text-lg shadow-lg shadow-accent/20" onClick={() => router.push('/pricing')}>
                  <Zap className="mr-2 h-5 w-5 fill-current" /> {t(lang, 'upgrade')}
                </Button>
              )}
            </CardContent>
          </Card>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Account Details</h3>
            <div className="grid gap-3">
              {[
                { icon: Mail, label: 'Email', value: user?.email || 'Not provided' },
                { icon: Phone, label: 'Phone', value: user?.phoneNumber || 'Not provided' },
                { icon: Globe, label: 'Language', value: languagesMap[userData?.language || 'en'] || 'English' },
                { icon: CreditCard, label: 'Billing', value: 'Google Play / UPI' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full h-14 border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-colors">
              <ShieldCheck className="mr-2 h-5 w-5" /> Privacy & Security
            </Button>
            <Button 
              variant="destructive" 
              className="w-full h-14 rounded-2xl font-black text-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" /> {t(lang, 'logout')}
            </Button>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
