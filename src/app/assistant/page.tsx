"use client"

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquareQuote, Send, Loader2, Bot, User, ShieldAlert, Sparkles } from "lucide-react"
import { getLegalScenarioGuidance, GetLegalScenarioGuidanceOutput } from "@/ai/flows/get-legal-guidance-flow"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: 'user' | 'assistant';
  content: string;
  guidance?: GetLegalScenarioGuidanceOutput;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Nyay AI Legal Assistant. You can ask me 'what-if' scenarios or specific legal questions for your business. How can I help today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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
      const result = await getLegalScenarioGuidance({ scenarioQuestion: userMessage })
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.guidance,
        guidance: result
      }])
    } catch (error) {
      toast({ title: "Error", description: "Failed to get guidance.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">Legal Assistant</h1>
          </div>
        </header>
        <main className="flex-1 p-6 flex flex-col max-w-5xl mx-auto w-full h-[calc(100vh-4rem)]">
          <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-t-4 border-t-accent">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-headline">Nyay Legal Bot</CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" /> Powered by GenAI • Context Aware
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted border text-primary'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted/50 border rounded-tl-none text-slate-800'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>

                      {msg.guidance && (
                        <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {msg.guidance.summary && (
                            <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">Key Summary</p>
                              <p className="text-sm italic">{msg.guidance.summary}</p>
                            </div>
                          )}
                          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-red-800 italic leading-relaxed">
                              {msg.guidance.disclaimer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%] items-start">
                    <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center animate-pulse">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-4 bg-muted/30 border rounded-2xl rounded-tl-none">
                      <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t bg-muted/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="w-full flex gap-2"
              >
                <Input 
                  placeholder="Ask a what-if legal scenario... (e.g., 'What if a client refuses to pay for delivered work?')"
                  className="flex-1 h-12 bg-white shadow-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button size="icon" className="h-12 w-12 rounded-full" disabled={!input.trim() || isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </div>
  )
}