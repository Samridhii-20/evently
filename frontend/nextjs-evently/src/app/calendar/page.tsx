'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import 'react-calendar/dist/Calendar.css';

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
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, selectedDate);
      });
      setSelectedDateEvents(filteredEvents);
    } else {
      setSelectedDateEvents([]);
    }
  }, [selectedDate, events]);

  const handleDateChange = (value: Date | Date[]):  Date | Date[] => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
    return value;
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const hasEvents = events.some(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });

    return hasEvents ? (
      <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Calendar</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          View all upcoming events in calendar format. Click on a date to see events scheduled for that day.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-xl">Loading calendar...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="calendar-container">
                  <Calendar 
                    onChange={handleDateChange as any} 
                    value={selectedDate} 
                    tileContent={tileContent}
                    className="w-full border-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length > 0 
                    ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled`
                    : selectedDate ? 'No events scheduled for this day' : 'Click on a date to see events'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map(event => (
                      <div 
                        key={event._id} 
                        className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => handleEventClick(event._id)}
                      >
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  selectedDate && (
                    <div className="text-center py-8 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No events found for this date</p>
                    </div>
                  )
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push('/events')}
                >
                  View All Events
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          background: white;
          border: none;
          font-family: inherit;
          line-height: 1.5;
        }
        .react-calendar__tile--active {
          background: #3b82f6;
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #2563eb;
        }
        .react-calendar__tile--now {
          background: #f3f4f6;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e5e7eb;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #e5e7eb;
        }
        .react-calendar__month-view__days__day--weekend {
          color: inherit;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}