import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Personal Details", description: "Tell us about yourself" },
  { id: 2, title: "Business Details", description: "Your business information" },
  { id: 3, title: "HMRC Setup", description: "Tax and compliance details" },
  { id: 4, title: "Complete", description: "Review and finish" }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    city: "",
    postcode: "",
    agreeToTerms: false
  });

  const [businessData, setBusinessData] = useState({
    name: "",
    companyNumber: "",
    utr: "",
    vatScheme: "",
    businessType: "",
    businessAddress: "",
    businessCity: "",
    businessPostcode: ""
  });

  const [hmrcData, setHmrcData] = useState({
    hmrcLogin: "",
    mtdAuthorized: false,
    hasRecords: false,
    hasClearanceLetter: false
  });

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return personalData.firstName && personalData.lastName && personalData.email && 
               personalData.role && personalData.postcode && personalData.agreeToTerms;
      case 2:
        return businessData.name && businessData.businessType && businessData.vatScheme;
      case 3:
        return true; // HMRC setup is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await register({
        ...personalData,
        password: "temp123", // In real app, this would be set during invitation
        role: "client"
      });
      
      toast({
        title: "Welcome to UK Tax Pro!",
        description: "Your account has been created successfully."
      });
      
      setLocation('/client/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={personalData.firstName}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={personalData.lastName}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@company.co.uk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalData.phone}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="07123 456789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role in Business *</Label>
              <Select value={personalData.role} onValueChange={(value) => setPersonalData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="sole_trader">Sole Trader</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="company_secretary">Company Secretary</SelectItem>
                  <SelectItem value="authorized_representative">Authorised Representative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={personalData.address}
                onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={personalData.city}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="London"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={personalData.postcode}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, postcode: e.target.value }))}
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={personalData.agreeToTerms}
                onCheckedChange={(checked) => setPersonalData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
              </Label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={businessData.name}
                onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Business Ltd"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={businessData.businessType} onValueChange={(value) => setBusinessData(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_trader">Sole Trader</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="limited_company">Limited Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatScheme">VAT Registration *</Label>
                <Select value={businessData.vatScheme} onValueChange={(value) => setBusinessData(prev => ({ ...prev, vatScheme: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select VAT scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_registered">Not Registered</SelectItem>
                    <SelectItem value="standard">Standard Rate</SelectItem>
                    <SelectItem value="flat_rate">Flat Rate</SelectItem>
                    <SelectItem value="cash_accounting">Cash Accounting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {businessData.businessType === 'limited_company' && (
              <div className="space-y-2">
                <Label htmlFor="companyNumber">Company Number</Label>
                <Input
                  id="companyNumber"
                  value={businessData.companyNumber}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, companyNumber: e.target.value }))}
                  placeholder="12345678"
                  maxLength={8}
                />
                <p className="text-sm text-muted-foreground">8-digit UK company number</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="utr">Unique Taxpayer Reference (UTR)</Label>
              <Input
                id="utr"
                value={businessData.utr}
                onChange={(e) => setBusinessData(prev => ({ ...prev, utr: e.target.value }))}
                placeholder="1234567890"
                maxLength={10}
              />
              <p className="text-sm text-muted-foreground">10-digit UTR from HMRC</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={businessData.businessAddress}
                onChange={(e) => setBusinessData(prev => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Business registered address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessCity">City</Label>
                <Input
                  id="businessCity"
                  value={businessData.businessCity}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, businessCity: e.target.value }))}
                  placeholder="London"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPostcode">Postcode</Label>
                <Input
                  id="businessPostcode"
                  value={businessData.businessPostcode}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, businessPostcode: e.target.value }))}
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hmrcLogin">HMRC Government Gateway User ID</Label>
              <Input
                id="hmrcLogin"
                value={hmrcData.hmrcLogin}
                onChange={(e) => setHmrcData(prev => ({ ...prev, hmrcLogin: e.target.value }))}
                placeholder="Enter your HMRC login"
              />
              <p className="text-sm text-muted-foreground">Optional: Used for Making Tax Digital submissions</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mtdAuthorized"
                  checked={hmrcData.mtdAuthorized}
                  onCheckedChange={(checked) => setHmrcData(prev => ({ ...prev, mtdAuthorized: checked as boolean }))}
                />
                <Label htmlFor="mtdAuthorized" className="text-sm">
                  I authorize UK Tax Pro for Making Tax Digital submissions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasRecords"
                  checked={hmrcData.hasRecords}
                  onCheckedChange={(checked) => setHmrcData(prev => ({ ...prev, hasRecords: checked as boolean }))}
                />
                <Label htmlFor="hasRecords" className="text-sm">
                  I have prior financial records to upload
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasClearanceLetter"
                  checked={hmrcData.hasClearanceLetter}
                  onCheckedChange={(checked) => setHmrcData(prev => ({ ...prev, hasClearanceLetter: checked as boolean }))}
                />
                <Label htmlFor="hasClearanceLetter" className="text-sm">
                  I have a professional clearance letter from my previous accountant
                </Label>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your accountant will review your information</li>
                <li>• You'll receive access to upload documents</li>
                <li>• Initial financial setup will be configured</li>
                <li>• Tax compliance schedules will be established</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto h-16 w-16 bg-success rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Setup Complete!</h3>
              <p className="text-muted-foreground">Welcome to UK Tax Pro</p>
            </div>
            
            <div className="bg-muted rounded-lg p-6 text-left">
              <h4 className="font-medium mb-4">Account Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{personalData.firstName} {personalData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{personalData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Business:</span>
                  <span>{businessData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">{businessData.businessType?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-primary">
                Your account is being set up. You'll receive an email confirmation shortly.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-success to-success/80 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Welcome to UK Tax Pro</CardTitle>
                <p className="text-success-foreground/80 mt-1">Let's set up your business account</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/login')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardHeader>

          {/* Progress */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between mt-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                    step.id <= currentStep
                      ? 'bg-success text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.id}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{steps[currentStep - 1]?.title}</h2>
              <p className="text-muted-foreground">{steps[currentStep - 1]?.description}</p>
            </div>

            {renderStepContent()}
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-success hover:bg-success/90"
              >
                {isLoading ? "Creating Account..." : "Complete Setup"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="bg-success hover:bg-success/90"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
