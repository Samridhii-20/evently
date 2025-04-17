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

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'finished' });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, status: 'scheduled' });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [eventDate]);

    const padNumber = (num: number): string => num.toString().padStart(2, '0');

    if (timeLeft.status === 'finished') {
        return (
            <div className="flex items-center gap-2">
                <span className="text-red-600 font-medium">Event Finished</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">Time Left:</span>
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
