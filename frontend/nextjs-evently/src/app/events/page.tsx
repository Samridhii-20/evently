'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import CreateEventModal from '@/components/events/CreateEventModal';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    id: string;
    name: string;
  };
  attendees: Array<{
    id: string;
    name: string;
  }>;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/events');
        const data = await response.json();
        
        if (response.ok) {
          setEvents(data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch events',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred while fetching events',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Discover and join exciting events happening around you. Connect with like-minded people and expand your horizons.
        </p>
        <div className="mt-6 flex justify-center">
          <CreateEventModal />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-xl">Loading events...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium mb-4">No events found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            There are no upcoming events at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            console.log(event);
            return <Card key={event._id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-1 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Organized by {event.organizer.name}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Link href={`/events/${event._id}`} className="w-full" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          })}
        </div>
      )}
    </div>
  );
}