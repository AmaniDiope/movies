
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        // Show error toast for non-admin
        if (window.toast) {
          window.toast.error("Access denied: Admins only.");
        } else if (typeof toast !== 'undefined') {
          toast.error("Access denied: Admins only.");
        } else {
          alert("Access denied: Admins only.");
        }
      }
    }
  };


  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-netflix-darkgray border-none shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
              />
              <p className="text-xs text-gray-500">
                Demo login: username: admin, password: admin123
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" variant="destructive" className="w-full">
              Sign In
            </Button>
            <div className="text-sm text-gray-400 text-center">
              Don't have an account? <Link to="/register" className="text-netflix-red hover:underline">Register</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
