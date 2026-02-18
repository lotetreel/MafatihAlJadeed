import { useMemo } from 'react';
import { motion } from 'framer-motion';
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



export function Calendar() {
  // Group all events by date
  const eventsByDate = useMemo(() => {
    return calendarEvents.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<number, typeof calendarEvents>);
  }, []);

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

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
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
          </motion.div>

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
                className="glass-card p-6"
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