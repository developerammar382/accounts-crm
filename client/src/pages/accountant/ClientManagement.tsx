import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AccountantLayout from "@/components/layouts/AccountantLayout";
import { 
  Search,
  UserPlus,
  Users,
  Building2,
  Clock,
  Eye,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function ClientManagement() {
  const { data: clientBusinesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  // Group businesses by client (ownerId)
  const clientsMap = new Map();
  clientBusinesses.forEach((business: any) => {
    const userId = business.ownerId;
    if (!clientsMap.has(userId)) {
      clientsMap.set(userId, {
        id: userId,
        businesses: [],
        name: `Client ${userId?.slice(0, 8)}`, // Mock name - would come from user table
        email: `client${userId?.slice(0, 4)}@example.com`, // Mock email
        lastActivity: new Date(business.createdAt).toLocaleDateString(),
        status: Math.random() > 0.7 ? 'pending-tasks' : 'active',
        pendingTasks: Math.floor(Math.random() * 5)
      });
    }
    clientsMap.get(userId).businesses.push(business);
  });

  const clients = Array.from(clientsMap.values());

  // Stats
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalBusinesses = clientBusinesses.length;
  const pendingInvites = 3; // Mock data

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success hover:bg-success/80">Active</Badge>;
      case 'pending-tasks':
        return <Badge variant="destructive">Action Needed</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending-tasks':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (businessesLoading) {
    return (
      <AccountantLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">
              Manage all your clients and their businesses
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite New Client
          </Button>
        </div>

        {/* Client Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold">{activeClients}</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                  <p className="text-2xl font-bold">{totalBusinesses}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
                  <p className="text-2xl font-bold">{pendingInvites}</p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Clients</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-9 w-72"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No clients found</h3>
                <p className="text-muted-foreground mb-6">
                  Invite your first client to get started with the platform
                </p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite First Client
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-left py-3 px-4 font-medium">Businesses</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                      <th className="text-left py-3 px-4 font-medium">Pending Tasks</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/placeholder-avatar.jpg" />
                              <AvatarFallback>
                                {client.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {client.businesses.slice(0, 2).map((business: any) => (
                              <div key={business.id} className="text-sm">
                                <p className="font-medium">{business.companyName}</p>
                                <p className="text-muted-foreground text-xs">
                                  {business.businessType?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                </p>
                              </div>
                            ))}
                            {client.businesses.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{client.businesses.length - 2} more
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(client.status)}
                            {getStatusBadge(client.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {client.lastActivity}
                        </td>
                        <td className="py-3 px-4">
                          {client.pendingTasks > 0 ? (
                            <Badge variant="outline" className="text-warning">
                              {client.pendingTasks} tasks
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-success">
                              0 tasks
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
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

        {/* Pending Invitations */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">john.doe@example.com</p>
                    <p className="text-sm text-muted-foreground">
                      Invited 2 days ago • Expires in 46 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">sarah.smith@company.co.uk</p>
                    <p className="text-sm text-muted-foreground">
                      Invited 5 days ago • Expires in 43 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">mike.johnson@business.com</p>
                    <p className="text-sm text-muted-foreground">
                      Invited 1 week ago • Expires in 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountantLayout>
  );
}