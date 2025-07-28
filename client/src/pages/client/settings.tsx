import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layout/client-layout";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import type { Business } from "@shared/schema";

export default function ClientSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postcode: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailDocumentReview: true,
    emailTaxDeadlines: true,
    emailAccountantActions: true,
    pushNotifications: false,
    smsReminders: false
  });

  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/users/${user?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setIsEditing(false);
      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const getVATSchemeDisplay = (scheme: string) => {
    const schemes = {
      'not_registered': 'Not Registered',
      'standard': 'Standard Rate',
      'flat_rate': 'Flat Rate',
      'cash_accounting': 'Cash Accounting'
    };
    return schemes[scheme as keyof typeof schemes] || scheme;
  };

  if (businessesLoading) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, business details, and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Businesses</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-lg">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="07123 456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="London"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={profileData.postcode}
                      onChange={(e) => setProfileData(prev => ({ ...prev, postcode: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="businesses">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Businesses</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businesses.length === 0 ? (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your first business to get started
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Business
                        </Button>
                      </div>
                    ) : (
                      businesses.map((business: Business) => (
                        <div key={business.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-lg">{business.name}</h3>
                                {businesses.indexOf(business) === 0 && (
                                  <Badge className="bg-success">Primary</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                {business.companyNumber && (
                                  <p>Company Number: {business.companyNumber}</p>
                                )}
                                {business.utr && (
                                  <p>UTR: {business.utr}</p>
                                )}
                                <p>Business Type: {business.businessType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                <p>VAT Scheme: {getVATSchemeDisplay(business.vatScheme!)}</p>
                                <p>Status: {business.isActive ? 'Active' : 'Inactive'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {business.accountantId && (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  <span className="text-sm text-muted-foreground">Accountant Assigned</span>
                                </div>
                              )}
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {businesses.length > 1 && (
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Accountant Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>Accountant Access</CardTitle>
                </CardHeader>
                <CardContent>
                  {businesses.some((b: Business) => b.accountantId) ? (
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">Accountant Assigned</p>
                            <p className="text-sm text-muted-foreground">
                              Your accountant has access to your business data
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" className="text-destructive">
                          Revoke Access
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">No Accountant Assigned</p>
                          <p className="text-sm text-muted-foreground">
                            You'll need an accountant invitation to connect your account
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Document Review Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your accountant reviews documents
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailDocumentReview}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailDocumentReview: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tax Deadline Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders for upcoming tax deadlines
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailTaxDeadlines}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailTaxDeadlines: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Accountant Actions</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified of actions taken by your accountant
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAccountantActions}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailAccountantActions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Get SMS reminders for important deadlines
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, smsReminders: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="mt-2"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="mt-2"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="mt-2"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Export Account Data</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a copy of your account data and business information
                    </p>
                    <Button variant="outline">Request Data Export</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="font-medium mb-2 text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
