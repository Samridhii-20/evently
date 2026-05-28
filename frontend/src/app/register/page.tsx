'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizingBody, setOrganizingBody] = useState('');
  const [designation, setDesignation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email domain for organizers only
    if (role === 'organizer' && !email.toLowerCase().endsWith('@bennett.edu.in')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Organizers must register with their Bennett University email address (@bennett.edu.in)',
      });
      setIsLoading(false);
      return;
    }

    // Validate password requirements
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
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      setIsLoading(false);
      return;
    }

    // Validate organizer-specific fields
    if (role === 'organizer' && (!organizingBody || !designation)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all organizer fields',
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'organizer' && { organizingBody, designation })
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server returned non-JSON response. Please try again later.');
      }

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.msg || 'Registration successful!',
        });
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.msg || 'Registration failed',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during registration',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-12 dark:bg-slate-950 transition-colors duration-300">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <CardHeader className="space-y-3 pb-6 text-center">
          <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create an Account</CardTitle>
          <CardDescription className="text-base text-slate-500 dark:text-slate-400">
            Sign up to start discovering or organizing events
          </CardDescription>
          
          {/* Sliding Toggle Control */}
          <div className="mt-4 inline-flex w-full p-1 bg-slate-100 dark:bg-slate-800 rounded-xl relative border border-slate-200/50 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setRole('attendee')}
              className={`w-1/2 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 z-10 ${role === 'attendee' ? 'text-blue-600 dark:text-white bg-white dark:bg-blue-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              I am an Attendee
            </button>
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={`w-1/2 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 z-10 ${role === 'organizer' ? 'text-blue-600 dark:text-white bg-white dark:bg-blue-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              I am an Organizer
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={role === 'organizer' ? "you@bennett.edu.in" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
              />
              {role === 'organizer' ? (
                <p className="text-xs text-blue-500 font-medium">Must end with @bennett.edu.in</p>
              ) : (
                <p className="text-xs text-slate-400 font-medium">Any valid email domain allowed</p>
              )}
            </div>

            {/* Conditional Organizer Fields */}
            {role === 'organizer' && (
              <div className="space-y-5 border-t border-slate-100 dark:border-slate-800 pt-5 animate-fadeIn">
                <div className="space-y-1.5">
                  <Label htmlFor="organizingBody" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Organizing Body Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizingBody"
                    type="text"
                    placeholder="ACM Student Chapter / Cultural Club"
                    value={organizingBody}
                    onChange={(e) => setOrganizingBody(e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="designation" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="President / Core Member / Lead"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
              />
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Min 8 characters with at least one number and one special character.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 py-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}