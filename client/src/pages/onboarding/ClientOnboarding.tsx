import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Building2, Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().min(1, "Postcode is required"),
});

const businessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum(["sole_trader", "partnership", "limited_company"]),
  companyNumber: z.string().optional(),
  utr: z.string().min(10, "UTR must be 10 digits").max(10, "UTR must be 10 digits"),
  vatScheme: z.enum(["standard", "flat_rate", "cash_accounting", "not_registered"]),
  vatNumber: z.string().optional(),
});

type Step = 1 | 2 | 3 | 4;

export default function ClientOnboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const personalForm = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "john.smith@example.co.uk",
      phone: "",
      address: "",
      city: "",
      postcode: "",
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: "",
      businessType: "limited_company" as const,
      companyNumber: "",
      utr: "",
      vatScheme: "standard" as const,
      vatNumber: "",
    },
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const getStepProgress = () => (currentStep / 4) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await personalForm.trigger();
      if (!isValid) return;
    } else if (currentStep === 2) {
      const isValid = await businessForm.trigger();
      if (!isValid) return;
    } else if (currentStep === 4 && !acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "Please accept the terms of service to continue.",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleComplete = async () => {
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "Please accept the terms of service to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would create the user account and business
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Auto-login the user
      await login(personalForm.getValues("email"), "tempPassword123");
      
      toast({
        title: "Welcome to UK Tax Pro!",
        description: "Your account has been created successfully.",
      });
      
      setLocation("/");
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
                  {...personalForm.register("firstName")}
                  placeholder="Enter your first name"
                />
                {personalForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...personalForm.register("lastName")}
                  placeholder="Enter your last name"
                />
                {personalForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...personalForm.register("email")}
                  placeholder="your.email@company.co.uk"
                />
                {personalForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...personalForm.register("phone")}
                  placeholder="07123 456789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...personalForm.register("address")}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...personalForm.register("city")}
                  placeholder="London"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  {...personalForm.register("postcode")}
                  placeholder="SW1A 1AA"
                />
                {personalForm.formState.errors.postcode && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.postcode.message}
                  </p>
                )}
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
                {...businessForm.register("businessName")}
                placeholder="Enter your business name"
              />
              {businessForm.formState.errors.businessName && (
                <p className="text-sm text-destructive">
                  {businessForm.formState.errors.businessName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select 
                value={businessForm.watch("businessType")} 
                onValueChange={(value) => businessForm.setValue("businessType", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole_trader">Sole Trader</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="limited_company">Limited Company</SelectItem>
                </SelectContent>
              </Select>
              {businessForm.formState.errors.businessType && (
                <p className="text-sm text-destructive">
                  {businessForm.formState.errors.businessType.message}
                </p>
              )}
            </div>

            {businessForm.watch("businessType") === "limited_company" && (
              <div className="space-y-2">
                <Label htmlFor="companyNumber">Company Number</Label>
                <Input
                  id="companyNumber"
                  {...businessForm.register("companyNumber")}
                  placeholder="12345678"
                  maxLength={8}
                />
                <p className="text-sm text-muted-foreground">8-digit UK company number</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="utr">Unique Taxpayer Reference (UTR) *</Label>
              <Input
                id="utr"
                {...businessForm.register("utr")}
                placeholder="1234567890"
                maxLength={10}
              />
              {businessForm.formState.errors.utr && (
                <p className="text-sm text-destructive">
                  {businessForm.formState.errors.utr.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">10-digit UTR from HMRC</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatScheme">VAT Registration Status *</Label>
              <Select 
                value={businessForm.watch("vatScheme")} 
                onValueChange={(value) => businessForm.setValue("vatScheme", value as any)}
              >
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
              {businessForm.formState.errors.vatScheme && (
                <p className="text-sm text-destructive">
                  {businessForm.formState.errors.vatScheme.message}
                </p>
              )}
            </div>

            {businessForm.watch("vatScheme") !== "not_registered" && (
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input
                  id="vatNumber"
                  {...businessForm.register("vatNumber")}
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
                  <p className="text-muted-foreground">
                    {personalForm.getValues("firstName")} {personalForm.getValues("lastName")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">{personalForm.getValues("email")}</p>
                </div>
                <div>
                  <p className="font-medium">Business:</p>
                  <p className="text-muted-foreground">{businessForm.getValues("businessName")}</p>
                </div>
                <div>
                  <p className="font-medium">Type:</p>
                  <p className="text-muted-foreground">
                    {businessForm.getValues("businessType")?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="font-medium">UTR:</p>
                  <p className="text-muted-foreground">{businessForm.getValues("utr")}</p>
                </div>
                <div>
                  <p className="font-medium">VAT Scheme:</p>
                  <p className="text-muted-foreground">
                    {businessForm.getValues("vatScheme")?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
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
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-gradient-to-r from-success/10 to-success/5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-success rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-success-foreground" />
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
                onClick={handleComplete}
                disabled={loading || !acceptTerms}
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