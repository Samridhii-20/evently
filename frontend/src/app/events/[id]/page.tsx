'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Image from 'next/image';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  eventImage?: string;
  organizer: {
    id: string;
    name: string;
  };
  attendees: Array<{
    id: string;
    name: string;
  }>;
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramsId } = use(params); 
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserId(userData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/events/${paramsId}`);
        const data = await response.json();
        
        if (response.ok) {
          // Ensure data has required properties

          const eventData = {
            ...data,
            eventImage: data.image,
            organizer: data.organizer || { id: '', name: 'Unknown' }
          };
          setEvent(eventData);
          // Check if user is already attending
          if (userId) {
            setIsAttending(eventData.attendees.some((attendee: any) => attendee.id === userId));
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: data.msg || 'Failed to fetch event details',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred while fetching event details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [paramsId, userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to register for this event',
      });
      router.push('/login');
      return;
    }

    // If there's a registration link, open it in a new tab
    if (event?.registrationLink) {
      try {
        const url = new URL(event.registrationLink);
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
        return;
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid registration link provided',
        });
        return;
      }
    }

    setIsRegistering(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/events/${paramsId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'You have successfully registered for this event',
        });
        setIsAttending(true);
        // Update the attendees list
        if (event) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setEvent({
            ...event,
            attendees: [...(event.attendees || []), { id: user.id, name: user.name }]
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.msg || 'Failed to register for event',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during registration',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsRegistering(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/events/${paramsId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'You have successfully unregistered from this event',
        });
        setIsAttending(false);
        // Update the attendees list
        if (event) {
          setEvent({
            ...event,
            attendees: event.attendees.filter(attendee => attendee.id !== userId)
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.msg || 'Failed to unregister from event',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during unregistration',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-pulse text-xl">Loading event details...</div>
    </div>
  ) : !event ? (
    <div className="text-center py-12">
      <h3 className="text-2xl font-medium mb-4">Event not found</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/events">
        <Button variant="outline">Back to Events</Button>
      </Link>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="relative w-full h-[400px] overflow-hidden">
          <Image
            src={event.eventImage ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/${event.eventImage}` : '/placeholder-event.svg'}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-event.svg';
              target.style.objectFit = 'contain';
              target.style.backgroundColor = '#f3f4f6';
            }}
          />
        </div>
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl">{event.title}</CardTitle>
          <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-base">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-base">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-base">Organized by {event.organizer?.name || 'Unknown'}</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-4">About this event</h3>
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 mb-6">
              {event.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push('/events')}>Back to Events</Button>
          {isLoggedIn && (
            isAttending ? (
              <Button variant="destructive" onClick={handleCancelRegistration} disabled={isRegistering}>
                {isRegistering ? 'Cancelling...' : 'Cancel Registration'}
              </Button>
            ) : (
              <Button onClick={handleRegister} disabled={isRegistering}>
                {isRegistering ? 'Registering...' : 'Register for Event'}
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  );
}