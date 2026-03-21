"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Files, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ExternalLink,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { format } from "date-fns"

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const { user } = useUser()
  const db = useFirestore()

  const docsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "users", user.uid, "documents"),
      orderBy("uploadDate", "desc")
    )
  }, [db, user])

  const { data: documents, isLoading } = useCollection(docsQuery)

  const filteredDocs = documents?.filter(doc => 
    doc.filename.toLowerCase().includes(search.toLowerCase()) || 
    doc.status.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleDelete = (docId: string) => {
    if (!db || !user) return
    const docRef = doc(db, "users", user.uid, "documents", docId)
    deleteDocumentNonBlocking(docRef)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">My Documents</h1>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents by name..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>
          </div>

          <Card className="shadow-none border overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Managed Legal Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="mt-2 text-sm text-muted-foreground">Syncing vault...</p>
                  </div>
                ) : filteredDocs.length > 0 ? filteredDocs.map((docItem) => (
                  <div key={docItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        docItem.status === 'failed' ? 'bg-red-50 text-red-600' : 
                        docItem.status === 'processed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-accent transition-colors">{docItem.filename}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground uppercase">{docItem.mimeType.split('/')[1]}</span>
                          <span className="text-xs text-muted-foreground opacity-50">•</span>
                          <span className="text-xs text-muted-foreground">
                            {docItem.uploadDate ? format(new Date(docItem.uploadDate), 'PPP') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        {docItem.status === 'processed' ? (
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        ) : docItem.status === 'failed' ? (
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                        <span className={`text-xs font-bold uppercase ${
                          docItem.status === 'failed' ? 'text-red-600' : 
                          docItem.status === 'processed' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {docItem.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(docItem.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Files className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">No documents found</p>
                    <p className="text-sm">Upload a document in the Translator or Risk Identifier to see it here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  )
}
