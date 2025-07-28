import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Building, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your business portal.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-success/10 to-success/5 dark:from-success/5 dark:to-success/10 px-4">
      <div className="fixed top-4 right-4">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-success rounded-lg flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">UK Tax Pro</CardTitle>
          <p className="text-muted-foreground">Business Owner Portal</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <Link href="#" className="text-sm text-success hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-success hover:bg-success/90" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to Business Portal"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Have an invitation link?{" "}
              <Link href="/onboarding" className="text-success hover:underline">
                Complete registration
              </Link>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="text-muted-foreground hover:text-success">
                ← Accountant login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
