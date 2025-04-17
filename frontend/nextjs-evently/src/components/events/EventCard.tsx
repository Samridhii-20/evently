import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import CountdownTimer from '@/components/shared/CountdownTimer';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  location: string;
  category: string;
}

export default function EventCard({ id, title, description, date, image, location, category }: EventCardProps) {
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Link href={`/events/${id}`}>
      <Card className="group h-full overflow-hidden rounded-xl border-0 shadow-lg transition-transform hover:scale-[1.02] bg-white dark:bg-slate-900">
        <div className="relative h-52 w-full">
          <img
            src={image ? (image.startsWith('http') ? image : `http://localhost:5001/${image.replace(/^\/*/, '')}`) : '/placeholder-event.svg'}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-event.svg';
            }}
          />
          <div className="absolute left-4 top-4">
            <span className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm text-white ${category === 'Tech and Innovation' ? 'bg-emerald-600' : category === 'Festival' ? 'bg-purple-600' : category === 'Cultural & Entertainment' ? 'bg-orange-700' : category === 'Academic' ? 'bg-indigo-700' : category === 'Sports' ? 'bg-teal-700' : 'bg-blue-600'}`}>
              {category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{title}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-6 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{formattedTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{location}</span>
            </div>
            <CountdownTimer eventDate={date} />
          </div>
        </div>
      </Card>
    </Link>
  );
}