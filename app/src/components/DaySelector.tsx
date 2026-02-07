import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Calendar, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { calendarEvents } from '@/data/content';

interface DaySelectorProps {
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

// Derive special days from calendar events by type
const qadrNights = new Set(
  calendarEvents.filter(e => e.type === 'night-of-power').map(e => e.date)
);
const martyrdomDays = new Set(
  calendarEvents.filter(e => e.type === 'martyrdom').map(e => e.date)
);
const birthDays = new Set(
  calendarEvents.filter(e => e.type === 'birth').map(e => e.date)
);
const occasionDays = new Set(
  calendarEvents.filter(e => e.type === 'occasion').map(e => e.date)
);

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);


  // Scroll to selected day
  useEffect(() => {
    if (selectedDay && scrollRef.current) {
      const dayButton = scrollRef.current.querySelector(`[data-day="${selectedDay}"]`);
      if (dayButton) {
        dayButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDay]);

  const handleDayClick = (day: number) => {
    if (selectedDay === day) {
      onSelectDay(null);
    } else {
      onSelectDay(day);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDayIndicator = (day: number) => {
    if (qadrNights.has(day)) return { type: 'qadr', color: 'bg-purple-500' };
    if (martyrdomDays.has(day)) return { type: 'martyrdom', color: 'bg-red-500' };
    if (birthDays.has(day)) return { type: 'birth', color: 'bg-emerald-500' };
    if (occasionDays.has(day)) return { type: 'occasion', color: 'bg-amber-500' };
    return null;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[hsl(var(--primary))]" />
          <h3 className="font-semibold">Select Day</h3>
        </div>

        {selectedDay ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSelectDay(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground 
                     hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </motion.button>
        ) : (
          <span className="text-sm text-muted-foreground">
            General practices showing
          </span>
        )}
      </div>

      {/* Selected day display */}
      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[hsl(var(--primary))]">{selectedDay}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Ramadan Day {selectedDay}</p>
                {/* Show calendar events for this day */}
                <div className="mt-1 space-y-1">
                  {calendarEvents
                    .filter(event => event.date === selectedDay)
                    .map((event, idx) => (
                      <p key={idx} className={`text-sm font-medium ${event.type === 'night-of-power' ? 'text-purple-400' :
                        event.type === 'martyrdom' ? 'text-red-400' :
                          event.type === 'birth' ? 'text-emerald-400' :
                            'text-amber-400'
                        }`}>
                        {event.type === 'night-of-power' && <Sparkles className="w-3 h-3 inline mr-1" />}
                        {event.title}
                      </p>
                    ))}
                  {calendarEvents.filter(event => event.date === selectedDay).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Special practices for this day are shown below
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-xl bg-secondary/50 border border-border/50"
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">General Practices</span> —
              Showing duas and a'amal that can be done any day during Ramadan.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll buttons */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full 
                   bg-card border border-border shadow-lg flex items-center justify-center
                   hover:bg-secondary transition-colors -ml-4"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full 
                   bg-card border border-border shadow-lg flex items-center justify-center
                   hover:bg-secondary transition-colors -mr-4"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Day buttons */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const indicator = getDayIndicator(day);
            const isSelected = selectedDay === day;

            return (
              <motion.button
                key={day}
                data-day={day}
                onClick={() => handleDayClick(day)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 w-10 h-12 rounded-lg flex flex-col items-center justify-center
                  text-sm font-medium transition-all ${isSelected
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg'
                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                  }`}
              >
                <span>{day}</span>

                {/* Indicator dot for special days */}
                {indicator && (
                  <span
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${indicator.color} 
                      border-2 border-background`}
                    title={indicator.type === 'qadr' ? 'Night of Power' :
                      indicator.type === 'martyrdom' ? 'Martyrdom' :
                        indicator.type === 'birth' ? 'Birth' :
                          'Occasion'}
                  />
                )}

                {/* Small dot at bottom for selected */}
                {isSelected && (
                  <motion.span
                    layoutId="selected-indicator"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-50"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Night of Power
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Martyrdom
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Birth
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Occasion
        </span>
      </div>
    </div>
  );
}
