"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookText, Languages, Loader2, Copy, CheckCircle2 } from "lucide-react"
import { translateLegalJargon } from "@/ai/flows/translate-legal-jargon-flow"
import { useToast } from "@/hooks/use-toast"

export default function TranslatorPage() {
  const [content, setContent] = useState("")
  const [translation, setTranslation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please paste the legal text you want to translate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await translateLegalJargon({ documentContent: content })
      setTranslation(result.plainLanguageTranslation)
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translation)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">Legal Jargon Translator</h1>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-10rem)]">
            <div className="flex flex-col gap-4">
              <Card className="flex-1 shadow-none border bg-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookText className="h-4 w-4 text-primary" /> Original Legal Text
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">{content.length} characters</span>
                  </div>
                  <CardDescription>Paste the complex legal document content below</CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  <Textarea
                    placeholder="Enter legal clauses, contracts, or terms of service..."
                    className="min-h-[400px] h-full w-full rounded-none border-0 focus-visible:ring-0 p-6 resize-none font-body text-sm leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </CardContent>
              </Card>
              <Button 
                onClick={handleTranslate} 
                disabled={isLoading} 
                className="w-full h-12 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Simplifying Legalities...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-5 w-5" />
                    Translate to Plain Language
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col h-full">
              <Card className="flex-1 shadow-none border bg-white overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" /> Plain Language Translation
                    </CardTitle>
                    {translation && (
                      <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                        {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  <CardDescription>AI-generated translation of complex terms</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-6 border-t bg-muted/5 whitespace-pre-wrap font-body text-sm leading-relaxed text-slate-700">
                  {!translation && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-4 py-20">
                      <BookText className="h-16 w-16" />
                      <p className="text-sm font-medium">Your translation will appear here</p>
                    </div>
                  )}
                  {isLoading && (
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    </div>
                  )}
                  {translation && (
                    <div className="prose prose-slate max-w-none">
                      {translation}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}