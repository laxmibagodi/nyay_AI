import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, FileSearch, FilePlus2, MessageSquareQuote, ShieldAlert, ShieldCheck, ArrowRight, Files, Activity, Zap } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-2">
            <h1 className="text-xl font-bold font-headline text-primary">Intelligence Center</h1>
          </div>
        </header>
        <main className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
          {/* Hero Banner */}
          <section className="relative rounded-3xl premium-gradient p-10 text-white overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-6 backdrop-blur-sm">
                <Zap className="h-3 w-3 text-yellow-400" /> V2.0 LIVE: Advanced Risk Analysis
              </div>
              <h2 className="text-4xl font-headline font-black mb-4 leading-tight">
                Fortify Your Business Legal Infrastructure.
              </h2>
              <p className="text-lg text-white/80 mb-8 font-medium">
                Harness GenAI to translate jargon, identify contract pitfalls, and draft ironclad agreements in seconds.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-xl px-8 shadow-lg transition-all hover:scale-105">
                  <Link href="/generator">Draft Document</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl px-8 backdrop-blur-md">
                  <Link href="/assistant">Talk to Assistant</Link>
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <ShieldCheck className="h-64 w-64 rotate-12" />
            </div>
          </section>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Documents", value: "24", sub: "+3 this week", icon: Files, color: "text-blue-600" },
              { label: "Compliance Score", value: "92%", sub: "High Stability", icon: ShieldCheck, color: "text-emerald-600" },
              { label: "Unresolved Risks", value: "02", sub: "Needs Review", icon: ShieldAlert, color: "text-orange-600" },
              { label: "AI Interactions", value: "158", sub: "Monthly Usage", icon: Activity, color: "text-purple-600" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pillars of Power */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-headline font-bold text-slate-800">Operational Pillars</h3>
              <p className="text-sm text-muted-foreground">Select a module to begin</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Jargon Translator", desc: "Convert archaic legal speak into actionable English.", icon: BookText, href: "/translator", theme: "from-blue-500 to-indigo-600" },
                { title: "Risk Analytics", desc: "Automated vulnerability scanning for your contracts.", icon: FileSearch, href: "/risks", theme: "from-violet-500 to-purple-600" },
                { title: "Smart Generator", desc: "Context-aware drafting for high-speed business.", icon: FilePlus2, href: "/generator", theme: "from-emerald-500 to-teal-600" },
                { title: "Legal Assistant", desc: "Strategic what-if guidance for business dilemmas.", icon: MessageSquareQuote, href: "/assistant", theme: "from-orange-500 to-rose-600" },
              ].map((pill) => (
                <Link key={pill.title} href={pill.href} className="group">
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${pill.theme}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pill.theme} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        <pill.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-accent transition-colors">{pill.title}</CardTitle>
                      <CardDescription className="leading-relaxed text-sm">{pill.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Vault Activity */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-headline font-bold text-slate-800">Recent Vault Activity</h3>
              <Button variant="ghost" className="text-accent font-bold" asChild>
                <Link href="/documents">View All Vault <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Vendor Master Agreement - Q1", type: "Risk Analysis", date: "45 mins ago", status: "Analyzed" },
                  { name: "Confidentiality Deed - Project X", type: "Generator", date: "Yesterday", status: "Draft" },
                  { name: "Website Terms & Conditions", type: "Translation", date: "3 days ago", status: "Secured" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Files className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.type} • {item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'Analyzed' ? 'bg-orange-100 text-orange-700' : 
                        item.status === 'Secured' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                      <Button variant="outline" size="sm" className="rounded-lg font-bold">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </div>
  )
}
