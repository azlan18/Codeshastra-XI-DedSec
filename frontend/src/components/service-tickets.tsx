"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Video, MessageSquare, Clock } from "lucide-react"

interface ServiceTicketsProps {
  fullView?: boolean
}

// Mock data for service tickets
const mockTickets = [
  {
    id: "T-1234",
    title: "Loan Application Inquiry",
    status: "In Progress",
    priority: "High",
    department: "Loans",
    createdAt: "2023-12-15T10:30:00Z",
    lastUpdated: "2023-12-16T14:20:00Z",
    description: "I need information about home loan options and eligibility criteria.",
    type: "video",
  },
  {
    id: "T-1235",
    title: "Credit Card Statement Issue",
    status: "Open",
    priority: "Medium",
    department: "Cards",
    createdAt: "2023-12-14T09:15:00Z",
    lastUpdated: "2023-12-14T09:15:00Z",
    description: "There's a transaction on my credit card statement that I don't recognize.",
    type: "chat",
  },
  {
    id: "T-1236",
    title: "Account Access Problem",
    status: "Resolved",
    priority: "High",
    department: "Digital Banking",
    createdAt: "2023-12-10T16:45:00Z",
    lastUpdated: "2023-12-12T11:30:00Z",
    description: "I'm unable to access my account through the mobile app.",
    type: "chat",
  },
  {
    id: "T-1237",
    title: "Fixed Deposit Query",
    status: "Scheduled",
    priority: "Low",
    department: "Investments",
    createdAt: "2023-12-13T14:20:00Z",
    lastUpdated: "2023-12-14T10:10:00Z",
    description: "I want to understand the current interest rates for fixed deposits.",
    type: "video",
  },
]

export const ServiceTickets = ({ fullView = false }: ServiceTicketsProps) => {
  const [activeTab, setActiveTab] = useState("all")

  // Filter tickets based on active tab
  const filteredTickets =
    activeTab === "all"
      ? mockTickets
      : mockTickets.filter((ticket) =>
          activeTab === "open"
            ? ["Open", "In Progress", "Scheduled"].includes(ticket.status)
            : ticket.status === "Resolved",
        )

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <Card className={fullView ? "h-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Service Tickets</CardTitle>
          <CardDescription>Track and manage your service requests</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="pt-4">
            <div className="space-y-4">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-3 ${
                            ticket.type === "video" ? "bg-blue-100" : "bg-green-100"
                          }`}
                        >
                          {ticket.type === "video" ? (
                            <Video
                              className={`h-4 w-4 ${ticket.type === "video" ? "text-blue-600" : "text-green-600"}`}
                            />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">{ticket.id}</span>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium mt-1">{ticket.title}</h4>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority} Priority
                      </Badge>
                    </div>

                    {fullView && <p className="text-sm text-muted-foreground mt-3 ml-10">{ticket.description}</p>}

                    <div className="flex justify-between items-center mt-3 ml-10">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {ticket.status === "Resolved" ? "Resolved on: " : "Last updated: "}
                          {formatDate(ticket.lastUpdated)}
                        </span>
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          {ticket.department}
                        </Badge>
                      </div>
                    </div>

                    {fullView && (
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="mr-2">
                          View Details
                        </Button>
                        {ticket.status !== "Resolved" && (
                          <Button size="sm">
                            {ticket.type === "video" ? (
                              <>
                                <Video className="mr-2 h-4 w-4" />
                                Join Video Call
                              </>
                            ) : (
                              <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Continue Chat
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No tickets found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "resolved"
                      ? "You don't have any resolved tickets yet."
                      : "You don't have any open tickets at the moment."}
                  </p>
                  {activeTab !== "resolved" && (
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Ticket
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {!fullView && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTickets.length} of {mockTickets.length} tickets
          </p>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("all")}>
            View All Tickets
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

