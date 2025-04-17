'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email domain
      if (!email.trim()) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please enter your email address',
        });
        setIsLoading(false);
        return;
      }

      if (!email.endsWith('@bennett.edu.in')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please use your Bennett University email address (@bennett.edu.in)',
        });
        setIsLoading(false);
        return;
      }

      // Validate password requirements
      if (!password) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please enter a new password',
        });
        setIsLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Password must be at least 8 characters long and contain at least one number and one special character',
        });
        setIsLoading(false);
        return;
      }

      // Validate passwords match
      if (!confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please confirm your new password',
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Passwords do not match',
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          throw new Error('Expected JSON response');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Unable to process server response. Please try again later.');
      }

      if (!response.ok) {
        let errorMessage = 'Failed to reset password';
        if (response.status === 404) {
          errorMessage = 'No account found with this email address';
        } else if (response.status === 401) {
          errorMessage = 'Unauthorized access';
        } else if (response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later';
        } else if (data?.msg) {
          errorMessage = data.msg;
        }
        throw new Error(errorMessage);
      }

      toast({
        title: 'Success',
        description: 'Password has been reset successfully',
      });
      router.push('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'An unexpected error occurred';
      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter your email and new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@bennett.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-center text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}