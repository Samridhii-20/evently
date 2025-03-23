'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setIsOrganizer(userData.role === 'organizer');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Discover & Create <span className="text-blue-600 dark:text-blue-400">Memorable</span> Events
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                Find the perfect events that match your interests or create your own to connect with like-minded people.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/events">
                <Button size="lg" className="h-12 px-6 text-base">
                  Explore Events
                </Button>
              </Link>
              
              {isLoggedIn && isOrganizer ? (
                <Link href="/events/create">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Create Event
                  </Button>
                </Link>
              ) : !isLoggedIn ? (
                <Link href="/register">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Sign Up
                  </Button>
                </Link>
              ) : null}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Join thousands of event enthusiasts</span>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-md animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-4/5 animate-pulse"></div>
                </div>
                <div className="h-10 bg-blue-100 dark:bg-blue-900/30 rounded-md w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}