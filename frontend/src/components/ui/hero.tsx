'use client';

import { Button } from '@/components/ui/button';
import CreateEventModal from '@/components/events/CreateEventModal';
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
              
              {isOrganizer && (
                <div className="mt-0">
                  <CreateEventModal />
                </div>
              )}
              
              {!isLoggedIn && (
                <Link href="/register">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
            
           <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-300">Find it</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-300">Book it</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-300">Live it</span>
              </div>
            </div>
          </div>
          
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-orange-500/10 overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
              <img
                src="/festival-hero.svg"
                alt="Festival Hero"
                className="w-full h-[600px] object-cover object-center rounded-[2rem] transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
