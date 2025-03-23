'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Calendar', href: '/calendar' },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsOrganizer(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Evently</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`text-base transition-colors hover:text-slate-900 dark:hover:text-slate-50 ${pathname === link.href ? 'font-medium text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isOrganizer && (
              <li>
                <Link 
                  href="/events/create"
                  className={`text-base transition-colors hover:text-slate-900 dark:hover:text-slate-50 ${pathname === '/events/create' ? 'font-medium text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Create Event
                </Link>
              </li>
            )}
          </ul>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-5 pt-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`block py-2 text-base ${pathname === link.href ? 'font-medium text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isOrganizer && (
              <Link 
                href="/events/create"
                className={`block py-2 text-base ${pathname === '/events/create' ? 'font-medium text-slate-900 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Event
              </Link>
            )}
            <div className="mt-4 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="default" className="w-full justify-start">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}