"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Files, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ExternalLink,
  FileText,
  ShieldCheck,
  ShieldAlert
} from "lucide-react"

const mockDocs = [
  { id: 1, name: "Employee Contract - John Doe", type: "Simple Contract", date: "2024-03-10", status: "Secure", size: "1.2 MB" },
  { id: 2, name: "Vendor NDA - Amazon Web Services", type: "NDA", date: "2024-03-05", status: "Risky", size: "850 KB" },
  { id: 3, name: "Office Lease Agreement", type: "Commercial Lease", date: "2024-02-28", status: "Review", size: "4.5 MB" },
  { id: 4, name: "Terms of Service - Website", type: "Compliance", date: "2024-02-15", status: "Secure", size: "1.1 MB" },
  { id: 5, name: "GST Reply - FY 2023", type: "Tax Notice", date: "2024-01-20", status: "Risky", size: "2.3 MB" },
]

export default function DocumentsPage() {
  const [search, setSearch] = useState("")

  const filteredDocs = mockDocs.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  )

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
                placeholder="Search documents by name or type..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
              <Button className="flex-1 md:flex-none bg-accent">
                Upload New
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
                {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        doc.status === 'Risky' ? 'bg-red-50 text-red-600' : 
                        doc.status === 'Secure' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-accent transition-colors">{doc.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{doc.type}</span>
                          <span className="text-xs text-muted-foreground opacity-50">•</span>
                          <span className="text-xs text-muted-foreground">{doc.size}</span>
                          <span className="text-xs text-muted-foreground opacity-50">•</span>
                          <span className="text-xs text-muted-foreground">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        {doc.status === 'Secure' ? (
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        ) : doc.status === 'Risky' ? (
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <span className={`text-xs font-bold uppercase ${
                          doc.status === 'Risky' ? 'text-red-600' : 
                          doc.status === 'Secure' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Files className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">No documents found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
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