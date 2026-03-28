"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Github, Chrome } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.12_0.01_260)] p-4">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[oklch(0.15_0.10_260)] via-[oklch(0.12_0.02_260)] to-[oklch(0.18_0.08_300)] opacity-50" />
      
      <Card className="z-10 w-full max-w-md border-[oklch(0.25_0.02_260)] bg-[oklch(0.18_0.01_260)]/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-[oklch(0.985_0_0)]">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-[oklch(0.65_0.01_260)]">
            {isLogin 
              ? "Enter your credentials to access your financial dashboard" 
              : "Sign up to start your AI-powered financial journey"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[oklch(0.145_0_0)] border-[oklch(0.25_0.02_260)] text-white focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[oklch(0.145_0_0)] border-[oklch(0.25_0.02_260)] text-white focus:ring-primary"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button 
              type="submit" 
              className="w-full bg-[oklch(0.60_0.18_260)] hover:bg-[oklch(0.55_0.16_260)] text-white transition-all"
              disabled={loading}
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[oklch(0.25_0.02_260)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[oklch(0.18_0.01_260)] px-2 text-[oklch(0.65_0.01_260)]">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="outline" 
              className="border-[oklch(0.25_0.02_260)] bg-transparent hover:bg-[oklch(0.25_0.02_260)] text-white"
              onClick={handleGoogleSignIn}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-[oklch(0.65_0.01_260)]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[oklch(0.60_0.18_260)] hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
