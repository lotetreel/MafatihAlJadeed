import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { calendarEvents } from '@/data/content';
import {
  CalendarDays,
  Moon,
  Star,
  Droplet,
  Crown
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const eventTypeConfig = {
  'occasion': {
    icon: Moon,
    color: 'bg-blue-500/20 text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  'night-of-power': {
    icon: Star,
    color: 'bg-amber-500/20 text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  'martyrdom': {
    icon: Droplet,
    color: 'bg-red-500/20 text-red-400',
    borderColor: 'border-red-500/30',
  },
  'birth': {
    icon: Crown,
    color: 'bg-emerald-500/20 text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
};

const levelConfig = {
  1: { name: 'Essential', color: 'emerald', icon: '✦' },
  2: { name: 'Striver', color: 'blue', icon: '★' },
  3: { name: 'Wayfarer', color: 'amber', icon: '♔' },
};

export function Calendar() {
  const [highlightedDate, setHighlightedDate] = useState<number | null>(null);
  const [maxLevel, setMaxLevel] = useState<1 | 2 | 3>(1);

  // Clear highlight after animation
  useEffect(() => {
    if (highlightedDate) {
      const timer = setTimeout(() => {
        setHighlightedDate(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedDate]);

  // Filter events by level
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => event.level <= maxLevel);
  }, [maxLevel]);

  // Group filtered events by date
  const eventsByDate = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<number, typeof filteredEvents>);
  }, [filteredEvents]);

  const sortedDates = Object.keys(eventsByDate).map(Number).sort((a, b) => a - b);

  return (
    <PageTransition>
      <div className="page-container relative pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Ramadan Calendar
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Calendar of Nights & Occasions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Key dates and religious occasions throughout the blessed month of Ramadan.
              Mark these nights in your calendar.
            </p>
            <div className="w-20 h-0.5 bg-[hsl(var(--primary))] mt-6" />
          </motion.div>

          {/* Legend & Level Toggle Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-4">
                {[
                  { type: 'occasion', label: 'Occasion' },
                  { type: 'night-of-power', label: 'Night of Power' },
                  { type: 'martyrdom', label: 'Martyrdom' },
                  { type: 'birth', label: 'Birth' },
                ].map(({ type, label }) => {
                  const config = eventTypeConfig[type as keyof typeof eventTypeConfig];
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Compact Level Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
                {([1, 2, 3] as const).map((level) => {
                  const config = levelConfig[level];
                  const isActive = maxLevel >= level;
                  const isSelected = maxLevel === level;

                  return (
                    <button
                      key={level}
                      onClick={() => setMaxLevel(level)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${isSelected
                        ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                        : isActive
                          ? 'text-muted-foreground hover:bg-secondary/80'
                          : 'text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/80'
                        }`}
                      style={isSelected ? {
                        backgroundColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.2)' :
                          config.color === 'blue' ? 'rgba(59, 130, 246, 0.2)' :
                            'rgba(245, 158, 11, 0.2)',
                        color: config.color === 'emerald' ? 'rgb(52, 211, 153)' :
                          config.color === 'blue' ? 'rgb(96, 165, 250)' :
                            'rgb(251, 191, 36)',
                        borderColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.3)' :
                          config.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                            'rgba(245, 158, 11, 0.3)',
                      } : {}}
                    >
                      <span>{config.icon}</span>
                      <span className="hidden sm:inline">{config.name}</span>
                      <span className="sm:hidden">L{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Full Month Overview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={maxLevel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
                Select a Night
                <span className="text-sm font-normal ml-2">
                  ({filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'})
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const dayEvents = filteredEvents.filter(e => e.date === day);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (hasEvents) {
                          setHighlightedDate(day);
                          const el = document.getElementById(`date-${day}`);
                          if (el) {
                            const yOffset = -100;
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }
                      }}
                      disabled={!hasEvents}
                      className={`min-h-[120px] p-4 rounded-xl border text-left transition-all duration-300 w-full ${hasEvents
                        ? 'bg-secondary/40 border-primary/20 hover:border-primary/40 hover:bg-secondary/60 cursor-pointer shadow-sm hover:shadow-md'
                        : 'bg-card/30 border-border/40 opacity-40 cursor-default'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-lg font-bold ${hasEvents ? 'text-primary' : 'text-muted-foreground/50'}`}>
                          {day}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {dayEvents.map((event, idx) => {
                          const config = eventTypeConfig[event.type];
                          const Icon = config.icon;

                          return (
                            <div key={idx} className="flex items-start gap-1.5">
                              <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${config.color.split(' ')[1]}`} />
                              <span className="text-xs font-medium leading-tight text-muted-foreground line-clamp-2" title={event.title}>
                                {event.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Detailed Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {sortedDates.map((date) => (
              <motion.div
                key={date}
                id={`date-${date}`}
                variants={itemVariants}
                animate={highlightedDate === date ? {
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0px 0px 0px 0px rgba(var(--primary), 0)",
                    "0px 0px 20px 0px rgba(var(--primary), 0.3)",
                    "0px 0px 0px 0px rgba(var(--primary), 0)"
                  ],
                  borderColor: [
                    "rgba(var(--primary), 0.1)",
                    "rgba(var(--primary), 0.5)",
                    "rgba(var(--primary), 0.1)"
                  ]
                } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
                className={`glass-card p-6 scroll-mt-32 transition-colors duration-500 ${highlightedDate === date ? 'bg-primary/5' : ''
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[hsl(var(--primary))]/20 flex flex-col items-center justify-center border border-[hsl(var(--primary))]/30">
                    <span className="text-2xl font-bold text-[hsl(var(--primary))]">{date}</span>
                    <span className="text-xs text-muted-foreground">Ramadan</span>
                  </div>

                  {/* Events */}
                  <div className="flex-1 space-y-3">
                    {eventsByDate[date].map((event, eventIndex) => {
                      const config = eventTypeConfig[event.type];
                      const Icon = config.icon;

                      return (
                        <div
                          key={eventIndex}
                          className={`p-3 rounded-lg border ${config.borderColor} bg-card/50`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                            <h3 className="font-semibold text-sm">{event.title}</h3>
                          </div>
                          {event.arabicTitle && (
                            <p className="arabic text-xs text-muted-foreground mb-1">
                              {event.arabicTitle}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}