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
  duration?: string;
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
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isApprovedOrganizer, setIsApprovedOrganizer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsApprovedOrganizer(userData.role === 'organizer' || userData.role === 'admin');
        } catch (e) {
          console.error(e);
          setIsApprovedOrganizer(false);
        }
      } else {
        setIsApprovedOrganizer(false);
      }
    };
    checkRole();
    window.addEventListener('auth-change', checkRole);
    return () => {
      window.removeEventListener('auth-change', checkRole);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/events`);
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

  // Filter out past events older than 1 month
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Apply filters
  const visibleEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    
    // 1. Filter out events older than 1 month ago
    if (eventDate < oneMonthAgo) {
      return false;
    }
    
    // 2. Filter by category
    if (categoryFilter !== 'All' && event.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });

  // Group events
  const upcomingEvents = visibleEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Closest first

  const pastEvents = visibleEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent past first

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
      
      {/* Header and Filter Controls */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Explore Collegiate Events
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Discover and register for upcoming events around campus, or review recent memories and past accomplishments.
        </p>

        {/* Dropdown Category Filter */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl shadow-md backdrop-blur-sm border border-slate-100 dark:border-slate-800">
          <label htmlFor="categorySelect" className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap px-2">
            Filter Category:
          </label>
          <select
            id="categorySelect"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Tech and Innovation">Tech and Innovation</option>
            <option value="Cultural & Entertainment">Cultural & Entertainment</option>
            <option value="Festival">Festival</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {/* Create Event Trigger for Organizers/Admins */}
        {isApprovedOrganizer && (
          <div className="flex justify-center pt-2">
            <CreateEventModal 
              buttonVariant="secondary"
              buttonSize="lg"
              triggerClassName="h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 cursor-pointer rounded-lg border-0"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 animate-spin"></div>
            <div className="text-lg text-slate-500">Loading collegiate events...</div>
          </div>
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 max-w-md mx-auto border border-slate-100 dark:border-slate-800">
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No events found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No events match the selected category filter at the moment. Please try another selection.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-3 h-8 bg-blue-600 rounded-full"></span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Upcoming Events</h2>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {upcomingEvents.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    id={event._id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    image={event.eventImage ? `${process.env.NEXT_PUBLIC_BACKEND_URI}${event.eventImage}` : '/placeholder-event.svg'}
                    location={event.location}
                    category={event.category || 'General'}
                    duration={event.duration}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <div className="space-y-6 opacity-90">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-3 h-8 bg-slate-500 rounded-full"></span>
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">Past Events <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(Last 30 Days)</span></h2>
                <span className="bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {pastEvents.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <div key={event._id} className="relative">
                    {/* Visual Overlay Badge for Past State */}
                    <div className="absolute right-4 top-4 z-10 bg-slate-800/95 dark:bg-slate-950/95 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                      Completed
                    </div>
                    <EventCard
                      id={event._id}
                      title={event.title}
                      description={event.description}
                      date={event.date}
                      image={event.eventImage ? `${process.env.NEXT_PUBLIC_BACKEND_URI}${event.eventImage}` : '/placeholder-event.svg'}
                      location={event.location}
                      category={event.category || 'General'}
                      duration={event.duration}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}