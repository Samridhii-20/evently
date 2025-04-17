'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  category?: string;
  createdAt?: string;
}

interface User {
  fullName: string;
  universityId: string;
  email: string;
  role: 'Attendee' | 'Organizer';
  avatar?: string;
}

export default function ProfilePage() {
  // Temporary mock data - will be replaced with actual data from backend
  const [user] = useState<User>({
    fullName: 'John Doe',
    universityId: 'U123456',
    email: 'john.doe@university.edu',
    role: 'Attendee',
    avatar: '/placeholder-event.svg'
  });

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: '2024-03-15',
      location: 'Main Auditorium',
      category: 'Technology',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Career Fair',
      date: '2024-04-20',
      location: 'Student Center',
      category: 'Career',
      createdAt: '2024-01-15'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8 p-6">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full">
            <Image
              src={user.avatar || '/placeholder-event.svg'}
              alt={user.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {user.fullName}
            </h1>
            <div className="mt-2 space-y-1 text-sm text-slate-500 dark:text-slate-400">
              <p>University ID: {user.universityId}</p>
              <p>Email: {user.email}</p>
              <p className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {user.role}
              </p>
            </div>
          </div>
          <Button variant="outline" className="self-start">
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Events Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {user.role === 'Attendee' ? 'My Registered Events' : 'My Created Events'}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {user.role === 'Attendee' && event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {user.role === 'Attendee' && event.category && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>{event.category}</span>
                    </div>
                  )}
                  {user.role === 'Organizer' && event.createdAt && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>Created: {new Date(event.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}