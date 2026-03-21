
"use client"

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MessageSquareQuote, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  ShieldAlert, 
  Sparkles, 
  Files, 
  ChevronDown,
  FileText,
  Search,
  BookOpen,
  Info
} from "lucide-react"
import { getLegalScenarioGuidance, GetLegalScenarioGuidanceOutput } from "@/ai/flows/get-legal-guidance-flow"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: 'user' | 'assistant';
  content: string;
  guidance?: GetLegalScenarioGuidanceOutput;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Greetings. I'm your Nyay AI Legal Strategist. You can consult me on 'what-if' scenarios or select a document from your Legal Vault to perform a contextual deep-dive. How may I assist your business today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const docsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "users", user.uid, "documents"),
      orderBy("uploadDate", "desc")
    )
  }, [db, user])

  const { data: documents } = useCollection(docsQuery)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const businessContext = selectedDoc 
        ? `CONTEXTUAL ANALYSIS REQUEST: The user is inquiring about their vault document: "${selectedDoc.filename}". 
           AI-Generated Summary: ${selectedDoc.description || 'No summary available'}. 
           Document Full Content: ${selectedDoc.content || 'N/A'}. 
           Please provide advice specifically tailored to this document's context.` 
        : "GENERAL GUIDANCE REQUEST: Provide general small business legal strategy without specific document context."

      const result = await getLegalScenarioGuidance({ 
        scenarioQuestion: userMessage,
        businessContext 
      })

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.guidance,
        guidance: result
      }])
    } catch (error) {
      toast({ 
        title: "Intelligence Gap", 
        description: "Encountered an error while processing your request. Please check your connection and retry.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold font-headline text-primary tracking-tight">AI Strategy Room</h1>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 flex flex-col max-w-6xl mx-auto w-full h-[calc(100vh-4rem)]">
          <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-none ring-1 ring-slate-200 bg-white rounded-3xl">
            <CardHeader className="border-b bg-slate-50/40 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-800">Nyay Legal Advisor</CardTitle>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Intelligence</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-accent" /> MSME Law Engine
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-[10px] font-black uppercase text-slate-400 hidden sm:block">Context Layer:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 font-bold h-10 px-4 rounded-xl border-slate-200 hover:bg-white hover:shadow-md transition-all">
                      <Files className="h-4 w-4 text-accent" />
                      {selectedDoc ? (
                        <span className="max-w-[140px] truncate">{selectedDoc.filename}</span>
                      ) : "Select Vault Document"}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-2xl border-none ring-1 ring-slate-200">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Managed Legal Vault</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setSelectedDoc(null)}
                      className="rounded-xl p-3 cursor-pointer hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">General Consultation</span>
                          <span className="text-[10px] text-slate-400">Broad legal guidance</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <ScrollArea className="h-[250px]">
                      {documents?.map(doc => (
                        <DropdownMenuItem 
                          key={doc.id} 
                          onClick={() => setSelectedDoc(doc)}
                          className="rounded-xl p-3 cursor-pointer hover:bg-accent/5 focus:bg-accent/5 mt-1"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-sm truncate">{doc.filename}</span>
                              <span className="text-[10px] text-slate-400 font-medium truncate">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      
                      {(!documents || documents.length === 0) && (
                        <div className="p-10 text-center">
                          <Files className="h-10 w-10 mx-auto text-slate-100 mb-3" />
                          <p className="text-xs font-bold text-slate-400">Vault is Empty</p>
                          <p className="text-[10px] text-slate-400 mt-2 px-4 leading-relaxed">
                            Upload documents in Translator or Risk modules to discuss them here.
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/20 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex shrink-0 items-center justify-center shadow-lg ${
                      msg.role === 'user' 
                      ? 'bg-primary text-white ring-4 ring-primary/10' 
                      : 'bg-white border text-accent ring-4 ring-slate-50'
                    }`}>
                      {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className="space-y-4">
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'
                      }`}>
                        <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                      </div>

                      {msg.guidance && (
                        <div className="space-y-4 mt-6 animate-in zoom-in-95 duration-500">
                          {msg.guidance.summary && (
                            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                              <div className="absolute left-0 top-0 w-1 h-full bg-accent" />
                              <div className="flex items-center gap-2 mb-3">
                                <Info className="h-3.5 w-3.5 text-accent" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Strategic Summary</p>
                              </div>
                              <p className="text-sm italic text-slate-600 leading-relaxed font-medium">
                                "{msg.guidance.summary}"
                              </p>
                            </div>
                          )}
                          <div className="bg-red-50/30 border border-red-100 p-5 rounded-2xl flex gap-4 items-start">
                            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1">Legal Safeguard</p>
                              <p className="text-[11px] text-red-800 font-medium leading-relaxed opacity-80 italic">
                                {msg.guidance.disclaimer}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4 max-w-[80%] items-start">
                    <div className="w-10 h-10 rounded-2xl bg-white border flex items-center justify-center animate-pulse shadow-sm">
                      <Bot className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting Intelligence...</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-6 border-t bg-white flex flex-col gap-4">
              {selectedDoc && (
                <div className="w-full flex items-center justify-between px-4 py-2 bg-accent/5 rounded-2xl border border-accent/10 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-accent text-white hover:bg-accent border-none text-[9px] font-black px-2 py-0.5">VAULT CONTEXT ACTIVE</Badge>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-accent" /> {selectedDoc.filename}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-transparent" 
                    onClick={() => setSelectedDoc(null)}
                  >
                    Clear Context
                  </Button>
                </div>
              )}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="w-full flex gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    placeholder={selectedDoc ? `Inquire about "${selectedDoc.filename}"...` : "Discuss a legal scenario or strategy..."}
                    className="flex-1 h-14 pl-12 bg-slate-50 border-slate-200 rounded-2xl font-bold shadow-inner transition-all focus-visible:ring-accent focus-visible:bg-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  size="icon" 
                  className="h-14 w-14 rounded-2xl accent-gradient shadow-xl shadow-accent/20 active:scale-[0.95] transition-transform flex-shrink-0" 
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-6 w-6" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </div>
  )
}
