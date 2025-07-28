import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Building, Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type Step = 1 | 2 | 3 | 4;

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "john.smith@example.co.uk",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    businessName: "",
    businessType: "" as "sole_trader" | "partnership" | "limited_company" | "",
    companyNumber: "",
    utr: "",
    vatScheme: "" as "standard" | "flat_rate" | "cash_accounting" | "not_registered" | "",
    vatNumber: "",
    acceptTerms: false,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "Please accept the terms of service to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      await api.auth.onboard({
        ...formData,
        email: formData.email,
      });
      
      toast({
        title: "Welcome to UK Tax Pro!",
        description: "Your account has been created successfully.",
      });
      
      // Redirect to client dashboard
      window.location.href = "/client";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your.email@company.co.uk"
                  required
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="07123 456789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="London"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => updateFormData("postcode", e.target.value)}
                  placeholder="SW1A 1AA"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData("businessName", e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
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

            {formData.businessType === "limited_company" && (
              <div className="space-y-2">
                <Label htmlFor="companyNumber">Company Number</Label>
                <Input
                  id="companyNumber"
                  value={formData.companyNumber}
                  onChange={(e) => updateFormData("companyNumber", e.target.value)}
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="utr">Unique Taxpayer Reference (UTR) *</Label>
              <Input
                id="utr"
                value={formData.utr}
                onChange={(e) => updateFormData("utr", e.target.value)}
                placeholder="1234567890"
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatScheme">VAT Registration Status *</Label>
              <Select value={formData.vatScheme} onValueChange={(value) => updateFormData("vatScheme", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VAT scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Rate</SelectItem>
                  <SelectItem value="flat_rate">Flat Rate Scheme</SelectItem>
                  <SelectItem value="cash_accounting">Cash Accounting</SelectItem>
                  <SelectItem value="not_registered">Not VAT Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.vatScheme !== "not_registered" && (
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input
                  id="vatNumber"
                  value={formData.vatNumber}
                  onChange={(e) => updateFormData("vatNumber", e.target.value)}
                  placeholder="GB123456789"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">HMRC Integration Setup</h3>
              <p className="text-muted-foreground">
                Configure your HMRC credentials for automated tax submissions
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Coming Soon</p>
                  <p className="text-sm text-muted-foreground">
                    HMRC integration will be available in the next update. For now, 
                    you can manually submit your returns through the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Upload any prior financial records or clearance letters from your previous accountant
                </p>
                <Button variant="outline" className="mt-2">
                  Upload Documents
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Complete</h3>
              <p className="text-muted-foreground">
                Please review your information and accept the terms to complete registration
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">{formData.email}</p>
                </div>
                <div>
                  <p className="font-medium">Business:</p>
                  <p className="text-muted-foreground">{formData.businessName}</p>
                </div>
                <div>
                  <p className="font-medium">Type:</p>
                  <p className="text-muted-foreground">
                    {formData.businessType?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="font-medium">UTR:</p>
                  <p className="text-muted-foreground">{formData.utr}</p>
                </div>
                <div>
                  <p className="font-medium">VAT Scheme:</p>
                  <p className="text-muted-foreground">
                    {formData.vatScheme?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => updateFormData("acceptTerms", checked)}
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Details";
      case 2: return "Business Details";
      case 3: return "HMRC Setup";
      case 4: return "Complete";
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="fixed top-4 right-4">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-gradient-to-r from-success/10 to-success/5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-success rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Welcome to UK Tax Pro</CardTitle>
                <p className="text-muted-foreground">Let's set up your business account</p>
              </div>
            </div>
          </CardHeader>

          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center space-x-2">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                      ${step <= currentStep 
                        ? "bg-success text-success-foreground" 
                        : "bg-muted text-muted-foreground"
                      }
                    `}>
                      {step}
                    </div>
                    <span className={`text-sm font-medium ${
                      step === currentStep ? "text-success" : "text-muted-foreground"
                    }`}>
                      {step === 1 && "Personal"}
                      {step === 2 && "Business"}
                      {step === 3 && "HMRC"}
                      {step === 4 && "Complete"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{getStepTitle()}</h2>
            </div>

            {renderStep()}
          </CardContent>

          <div className="px-6 py-4 bg-muted/50 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-success hover:bg-success/90"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.acceptTerms}
                className="bg-success hover:bg-success/90"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
