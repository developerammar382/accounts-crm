import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Moon, Sun, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState<'client' | 'accountant'>('client');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    if (user.role === 'accountant') {
      setLocation('/accountant/dashboard');
    } else {
      setLocation('/client/dashboard');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to UK Tax Pro",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className={`mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-6 ${
            loginType === 'accountant' ? 'bg-primary' : 'bg-success'
          }`}>
            {loginType === 'accountant' ? (
              <Calculator className="h-6 w-6 text-white" />
            ) : (
              <Building2 className="h-6 w-6 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">UK Tax Pro</h1>
          <p className="mt-2 text-muted-foreground">
            {loginType === 'accountant' ? 'Accountant Portal' : 'Business Owner Portal'}
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex rounded-lg border p-1 bg-muted">
          <button
            type="button"
            onClick={() => setLoginType('client')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              loginType === 'client'
                ? 'bg-success text-success-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Business Owner
          </button>
          <button
            type="button"
            onClick={() => setLoginType('accountant')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              loginType === 'accountant'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Accountant
          </button>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className={`w-full ${
                  loginType === 'accountant' 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-success hover:bg-success/90'
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {loginType === 'accountant' ? (
                  <>Need to invite a client? <Button variant="link" className="p-0 h-auto text-sm">Send invitation</Button></>
                ) : (
                  <>Have an invitation link? <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setLocation('/onboarding')}>Complete registration</Button></>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
