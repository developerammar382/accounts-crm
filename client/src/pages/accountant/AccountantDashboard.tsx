import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import AccountantLayout from "@/components/layouts/AccountantLayout";
import { 
  Users, 
  Clock, 
  FileText, 
  Eye, 
  PoundSterling,
  AlertTriangle,
  CheckCircle,
  Upload,
  TrendingUp,
  ArrowRight,
  Search
} from "lucide-react";
import { useLocation } from "wouter";

export default function AccountantDashboard() {
  const [, setLocation] = useLocation();

  const { data: clientBusinesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  // Calculate metrics
  const totalClients = new Set(clientBusinesses.map((b: any) => b.ownerId)).size;
  const totalBusinesses = clientBusinesses.length;
  const pendingTasks = 12; // Mock data
  const vatReturnsDue = clientBusinesses.filter((b: any) => b.vatScheme !== 'not_registered').length;

  // Recent client activity (mocked)
  const recentActivity = [
    {
      id: '1',
      type: 'document_upload',
      description: 'Invoice uploaded for review',
      businessName: 'Smith Consulting Ltd',
      time: '2 hours ago',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      type: 'vat_return',
      description: 'VAT return ready for approval',
      businessName: 'Tech Solutions Ltd',
      time: '4 hours ago',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '3',
      type: 'payment',
      description: 'Invoice payment received',
      businessName: 'Global Services Inc',
      time: '6 hours ago',
      avatar: '/placeholder-avatar.jpg'
    }
  ];

  // Urgent tasks
  const urgentTasks = [
    {
      id: 'vat-return-urgent',
      title: 'VAT Return Q4 2024',
      description: 'Smith Consulting Ltd - Due: Feb 7, 2025',
      type: 'high' as const,
      action: 'Review',
      daysLeft: 5,
      onClick: () => setLocation('/tax-filing')
    },
    {
      id: 'document-review',
      title: 'Document Review',
      description: `${pendingTasks} documents pending review`,
      type: 'medium' as const,
      action: 'Review Documents',
      onClick: () => setLocation('/documents/review')
    },
    {
      id: 'client-approval',
      title: 'CIS Return Ready',
      description: 'Global Services - Pending client approval',
      type: 'low' as const,
      action: 'Send for Approval',
      onClick: () => setLocation('/tax-filing')
    }
  ];

  // Client overview data (top clients)
  const topClients = clientBusinesses.slice(0, 4).map((business: any) => ({
    id: business.id,
    name: business.companyName,
    type: business.businessType,
    revenue: Math.floor(Math.random() * 100000) + 25000,
    vatStatus: business.vatScheme,
    status: Math.random() > 0.3 ? 'up-to-date' : 'action-needed',
    nextDeadline: 'VAT Return - Feb 7'
  }));

  if (businessesLoading) {
    return (
      <AccountantLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout>
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-3xl font-bold">{totalClients}</p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 new this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-3xl font-bold">{pendingTasks}</p>
                  <p className="text-sm text-warning">5 urgent</p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VAT Returns Due</p>
                  <p className="text-3xl font-bold">{vatReturnsDue}</p>
                  <p className="text-sm text-destructive">Due within 2 weeks</p>
                </div>
                <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents to Review</p>
                  <p className="text-3xl font-bold">{pendingTasks}</p>
                  <p className="text-sm text-muted-foreground">From {totalClients} clients</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Urgent Tasks & Deadlines</CardTitle>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="vat">VAT Returns</SelectItem>
                      <SelectItem value="documents">Document Reviews</SelectItem>
                      <SelectItem value="approvals">Client Approvals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      task.type === 'high'
                        ? 'bg-destructive/5 border-destructive/20'
                        : task.type === 'medium'
                        ? 'bg-warning/5 border-warning/20'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        task.type === 'high'
                          ? 'bg-destructive/10'
                          : task.type === 'medium'
                          ? 'bg-warning/10'
                          : 'bg-primary/10'
                      }`}>
                        {task.type === 'high' ? (
                          <AlertTriangle className={`h-5 w-5 text-destructive`} />
                        ) : task.type === 'medium' ? (
                          <Clock className={`h-5 w-5 text-warning`} />
                        ) : (
                          <CheckCircle className={`h-5 w-5 text-primary`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.daysLeft && (
                        <Badge variant="outline" className="text-xs">
                          {task.daysLeft} days left
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={task.onClick}
                        className={
                          task.type === 'high'
                            ? 'bg-destructive hover:bg-destructive/90'
                            : task.type === 'medium'
                            ? 'bg-warning hover:bg-warning/90'
                            : 'bg-primary hover:bg-primary/90'
                        }
                      >
                        {task.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Client Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.businessName} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:text-primary/80"
                onClick={() => setLocation('/clients')}
              >
                View All Clients
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Client Overview Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Overview</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-9 w-64"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Tasks</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {topClients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No clients found</h3>
                <p className="text-muted-foreground">
                  Invite your first client to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-left py-3 px-4 font-medium">Business Type</th>
                      <th className="text-left py-3 px-4 font-medium">Revenue (YTD)</th>
                      <th className="text-left py-3 px-4 font-medium">VAT Status</th>
                      <th className="text-left py-3 px-4 font-medium">Next Deadline</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {topClients.map((client) => (
                      <tr key={client.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-avatar.jpg" />
                              <AvatarFallback>
                                {client.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{client.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {client.type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {client.type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          £{client.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={client.vatStatus === 'not_registered' ? 'outline' : 'default'}>
                            {client.vatStatus === 'not_registered' ? 'Not Registered' : 'Registered'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {client.nextDeadline}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Manage
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AccountantLayout>
  );
}