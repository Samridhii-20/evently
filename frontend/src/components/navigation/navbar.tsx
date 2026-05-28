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
  const [role, setRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setRole(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  useEffect(() => {
    updateAuthState();
    
    window.addEventListener('auth-change', updateAuthState);
    return () => {
      window.removeEventListener('auth-change', updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthState();
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  const isApprovedOrganizer = role === 'organizer' || role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm dark:border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">Evently</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`text-base font-medium transition-colors hover:text-white/90 ${pathname === link.href ? 'text-white' : 'text-white/80'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {role === 'admin' && (
              <li>
                <Link 
                  href="/admin"
                  className={`text-base font-medium transition-colors hover:text-white/90 ${pathname === '/admin' ? 'text-white' : 'text-white/80'}`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button variant="secondary" size="sm" onClick={handleLogout} className="text-white bg-white/10 hover:bg-white/20 border-white/20">Logout</Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:text-white/90 hover:bg-white/10">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm" className="text-white bg-white/10 hover:bg-white/20 border-white/20">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white" 
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
        <div className="md:hidden bg-gradient-to-b from-indigo-600 to-indigo-700 border-t border-white/10">
          <div className="space-y-1 px-4 pb-5 pt-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`block py-2 text-base font-medium transition-colors ${pathname === link.href ? 'text-white' : 'text-white/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {role === 'admin' && (
              <Link 
                href="/admin"
                className={`block py-2 text-base font-medium transition-colors ${pathname === '/admin' ? 'text-white' : 'text-white/80'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="mt-4 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" className="w-full justify-start text-white border-white/20 bg-white/10 hover:bg-white/20" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">Login</Button>
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="secondary" className="w-full justify-start text-white bg-white/10 hover:bg-white/20 border-white/20">Sign Up</Button>
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