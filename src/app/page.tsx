import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, FileSearch, FilePlus2, MessageSquareQuote, ShieldAlert, ShieldCheck, ArrowRight, Files } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">Overview</h1>
          </div>
        </header>
        <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-2 bg-primary text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="h-48 w-48" />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl font-headline">Welcome to Nyay AI</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg max-w-xl">
                  Your AI-powered legal shield. We help small businesses navigate complex legalities with ease, precision, and speed.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex gap-4 mt-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/generator">Generate Document</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground">
                  <Link href="/risks">Analyze Risks</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between border-l-4 border-l-accent shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  <ShieldAlert className="h-4 w-4" /> Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">High Risk</div>
                <p className="text-sm text-muted-foreground mt-1">2 vendor agreements need immediate review</p>
                <Button variant="link" className="px-0 mt-4 text-accent hover:text-accent/80" asChild>
                  <Link href="/risks" className="flex items-center gap-1">Fix Now <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <section className="space-y-4">
            <h2 className="text-xl font-headline font-semibold">Core Capability Pillars</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Translator", desc: "Complex jargon to plain English", icon: BookText, href: "/translator", color: "bg-blue-50 text-blue-600" },
                { title: "Risk ID", desc: "Scan contracts for pitfalls", icon: FileSearch, href: "/risks", color: "bg-purple-50 text-purple-600" },
                { title: "Generator", desc: "Auto-draft NDAs & Contracts", icon: FilePlus2, href: "/generator", color: "bg-emerald-50 text-emerald-600" },
                { title: "Assistant", desc: "Step-by-step guidance", icon: MessageSquareQuote, href: "/assistant", color: "bg-orange-50 text-orange-600" },
              ].map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="group hover:border-accent hover:shadow-md transition-all h-full">
                    <CardHeader className="space-y-1">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activity Mockup */}
          <section className="space-y-4">
            <h2 className="text-xl font-headline font-semibold">Recent Documents</h2>
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="divide-y">
                {[
                  { name: "Vendor Service Level Agreement.pdf", type: "Risk Analysis", date: "2 hours ago", status: "Completed" },
                  { name: "Standard NDA - Tech Project.docx", type: "Generated", date: "Yesterday", status: "Draft" },
                  { name: "Commercial Lease Terms.pdf", type: "Translation", date: "3 days ago", status: "Completed" },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Files className="h-8 w-8 text-muted-foreground/40" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${doc.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {doc.status}
                      </span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </div>
  )
}
