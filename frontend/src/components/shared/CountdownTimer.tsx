'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    eventDate: string | Date;
}

export default function CountdownTimer({ eventDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; status: string }>(
        { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'scheduled' }
    );

    useEffect(() => {
        const calculateTimeLeft = () => {
            const eventDateTime = new Date(eventDate);
            const now = new Date();
            
            const difference = eventDateTime.getTime() - now.getTime();
            
            // Event has already passed
            if (difference <= 0) {
                const minutesPassed = Math.abs(Math.floor(difference / (1000 * 60)));
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: minutesPassed > 30 ? 'finished' : 'started' });
                return;
            }
            
            // Get event day at midnight
            const eventDay = new Date(eventDateTime.getFullYear(), eventDateTime.getMonth(), eventDateTime.getDate());
            const isToday = eventDay.toDateString() === now.toDateString();
            
            if (isToday) {
                // For events today, show countdown to exact start time
                const totalSeconds = Math.floor(difference / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                setTimeLeft({ days: 0, hours, minutes, seconds, status: 'today' });
            } else {
                // For future events, show days and time until event
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                setTimeLeft({ days, hours, minutes, seconds, status: 'scheduled' });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [eventDate]);

    const padNumber = (num: number): string => num.toString().padStart(2, '0');

    if (timeLeft.status === 'started') {
        return (
            <div className="flex items-center gap-2">
                <span className="text-orange-600 font-medium">Event Started</span>
            </div>
        );
    } else if (timeLeft.status === 'finished') {
        return (
            <div className="flex items-center gap-2">
                <span className="text-red-600 font-medium">Event Finished</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className={`font-medium ${timeLeft.status === 'today' ? 'text-orange-600' : 'text-green-600'}`}>
                {timeLeft.status === 'today' ? 'Starting in:' : 'Time Left:'}
            </span>
            <div className="flex items-center gap-1">
                {timeLeft.days > 0 && (
                    <>
                        <span className="font-mono font-medium">{timeLeft.days}d</span>
                        <span className="text-gray-400">:</span>
                    </>
                )}
                <span className="font-mono font-medium">{padNumber(timeLeft.hours)}</span>
                <span className="text-gray-400">:</span>
                <span className="font-mono font-medium">{padNumber(timeLeft.minutes)}</span>
                <span className="text-gray-400">:</span>
                <span className="font-mono font-medium">{padNumber(timeLeft.seconds)}</span>
            </div>
        </div>
    );
}