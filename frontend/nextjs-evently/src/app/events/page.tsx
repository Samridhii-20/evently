'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import CreateEventModal from '@/components/events/CreateEventModal';
import EventCard from '@/components/events/EventCard';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  eventImage?: string;
  category: string;
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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/events');
        const data = await response.json();

        if (response.ok) {

          
          const eventsArr = data.map((ev: any) => {
            return {
              ...ev,
              eventImage: ev.image,
              organizer: ev.organizer || { id: '', name: 'Unknown' }
            }
          });
        

          setEvents(eventsArr);
          setFilteredEvents(eventsArr);
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
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search events by category..."
              value={searchTerm}
              onChange={(e) => {
                const term = e.target.value.toLowerCase();
                setSearchTerm(term);
                setFilteredEvents(
                  events.filter(event =>
                    event.category.toLowerCase().includes(term)
                  )
                );
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-xl">Loading events...</div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium mb-4">No events found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            There are no upcoming events at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            return <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              date={event.date}
              image={event.eventImage ? (event.eventImage.startsWith('http') ? event.eventImage : `http://localhost:5001${event.eventImage.startsWith('/') ? event.eventImage : `/${event.eventImage}`}`) : '/placeholder-event.svg'}
              location={event.location}
              category={event.category || 'General'}
            />
          })}
        </div>
      )}
    </div>
  );
}