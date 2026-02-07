import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { SwipeableItem } from '@/components/SwipeableItem';
import { DaySelector } from '@/components/DaySelector';
import { useCompletion } from '@/contexts/CompletionContext';
import { duas, aamal } from '@/data/content';
import {
  Hand,
  BookOpen,
  Clock,
  ChevronRight,
  Moon,
  Sun,
  CalendarDays,
  ChevronDown
} from 'lucide-react';

// Combined item type for display
interface CombinedItem {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  level: 1 | 2 | 3;
  source: string;
  type: 'dua' | 'aamal';
  timing?: string;
  applicableDays: 'all' | number[];
  arabicText?: string;
  englishTranslation?: string;
  transliteration?: string;
  instructions?: string[];
}

interface ExpandableDescriptionProps {
  text: string;
  maxLength?: number;
}

function ExpandableDescription({ text, maxLength = 120 }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (!shouldTruncate) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">
        {text}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 48 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="text-sm text-muted-foreground leading-relaxed overflow-hidden"
      >
        {text}
      </motion.div>
      <button
        onClick={toggleExpand}
        className="mt-1 text-muted-foreground/60 hover:text-[hsl(var(--primary))] transition-colors p-0.5 rounded-full hover:bg-secondary/50"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}

import contentOrderRaw from '@/data/content_order.json';
const contentOrder = contentOrderRaw as string[];

export function AamalDua() {
  const navigate = useNavigate();
  // maxLevel is cumulative - shows all items from level 1 up to maxLevel
  const [maxLevel, setMaxLevel] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { isCompleted, toggleComplete } = useCompletion();

  // Combine duas and a'amal - Sorted by global order
  const allItems = useMemo<CombinedItem[]>(() => {
    const combined = [
      ...aamal.map(a => ({ ...a, type: 'aamal' as const })),
      ...duas.map(d => ({ ...d, type: 'dua' as const }))
    ];

    return combined.sort((a, b) => {
      const indexA = contentOrder.indexOf(a.id);
      const indexB = contentOrder.indexOf(b.id);

      // If both are in the order list, sort by index
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only A is in the list, it comes first
      if (indexA !== -1) return -1;

      // If only B is in the list, it comes first
      if (indexB !== -1) return 1;

      // Fallback: Group Aamal first if not sorted (legacy behavior)
      if (a.type !== b.type) {
        return a.type === 'aamal' ? -1 : 1;
      }

      return 0;
    });
  }, []);

  // Filter items based on level and day
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Level filter (cumulative)
      const levelMatch = item.level <= maxLevel;

      // Day filter
      let dayMatch = false;
      if (item.applicableDays === 'all') {
        // General items always show
        dayMatch = true;
      } else if (selectedDay !== null) {
        // Day-specific items only show when that day is selected
        dayMatch = item.applicableDays.includes(selectedDay);
      } else {
        // When no day selected, don't show day-specific items
        dayMatch = false;
      }

      return levelMatch && dayMatch;
    });
  }, [allItems, maxLevel, selectedDay]);

  // Separate for stats display
  const filteredDuas = filteredItems.filter(item => item.type === 'dua');
  const filteredAamal = filteredItems.filter(item => item.type === 'aamal');

  // Count day-specific items for the selected day
  const daySpecificItems = useMemo(() => {
    if (!selectedDay) return [];
    return allItems.filter(item =>
      item.level <= maxLevel &&
      item.applicableDays !== 'all' &&
      item.applicableDays.includes(selectedDay)
    );
  }, [allItems, maxLevel, selectedDay]);



  return (
    <PageTransition>
      <div className="page-container relative pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Hand className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Daily Practices
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Aamal & Dua
            </h1>

            <div className="w-20 h-0.5 bg-[hsl(var(--primary))] mt-6" />
          </motion.div>

          {/* Main Content - Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Level Selection & Day Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:w-80 xl:w-96 flex-shrink-0 space-y-6"
            >
              {/* Compact Level Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
                {([1, 2, 3] as const).map((level) => {
                  const config = {
                    1: { name: 'Essential', color: 'emerald', icon: '✦' },
                    2: { name: 'Striver', color: 'blue', icon: '★' },
                    3: { name: 'Wayfarer', color: 'amber', icon: '♔' },
                  }[level];

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
                      <span>{config.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Day Selector */}
              <div className="glass-card p-6">
                <DaySelector
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              </div>


            </motion.div>

            {/* Right Column - Items Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1"
            >
              {/* Section header */}
              <div className="mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">
                      {selectedDay ? `Day ${selectedDay} Practices` : 'General Practices'}
                    </h2>
                    <p className="text-muted-foreground">
                      Showing {filteredItems.length} {filteredItems.length === 1 ? 'practice' : 'practices'}
                      {selectedDay && daySpecificItems.length > 0 && (
                        <span className="text-[hsl(var(--primary))]">
                          {' '}(including {daySpecificItems.length} special for this day)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quick stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>{filteredAamal.length} A'amal</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>{filteredDuas.length} Duas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            layout: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 }
                          }}
                        >
                          <SwipeableItem
                            isCompleted={isCompleted(item.id)}
                            onToggle={() => toggleComplete(item.id)}
                            className="glass-card p-5 hover-lift group cursor-pointer"
                            onClick={() => navigate(`/aamal-dua/${item.id}`)}
                          >
                            <div className="flex items-start justify-between mb-3 pr-10">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'dua'
                                ? 'bg-indigo-500/20'
                                : 'bg-amber-500/20'
                                }`}>
                                {item.type === 'dua' ? (
                                  <BookOpen className="w-5 h-5 text-indigo-400" />
                                ) : (
                                  <Clock className="w-5 h-5 text-amber-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                {/* Day-specific badge */}
                                {item.applicableDays !== 'all' && (
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
                                    Day {item.applicableDays.join(', ')}
                                  </span>
                                )}
                                {/* Type badge */}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'dua'
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                  {item.type === 'dua' ? 'Dua' : "A'mal"}
                                </span>
                                {/* Level badge */}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.level === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                                  item.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-purple-500/20 text-purple-400'
                                  }`}>
                                  L{item.level}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-base font-semibold mb-0.5">{item.name}</h3>
                            <p className="arabic text-sm text-muted-foreground mb-2">{item.arabicName}</p>

                            {/* Show timing for a'amal */}
                            {'timing' in item && item.timing && (
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.timing}</span>
                              </div>
                            )}

                            <ExpandableDescription text={item.description} />

                            <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {item.source}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-[hsl(var(--primary))]">
                                <span>View Full</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </SwipeableItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-16 glass-card rounded-xl"
                  >
                    <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      {selectedDay ? 'No special practices for this day' : 'Select a day'}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {selectedDay
                        ? `There are no level ${maxLevel} or below practices specifically for day ${selectedDay}. Try selecting a different level or day.`
                        : 'Select a specific day from the calendar to see special duas and a\'amal for that date, or increase your level to see more general practices.'
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-muted-foreground mt-8"
              >
                💡 Tip: Swipe right to mark as complete, or click the check button
              </motion.p>
            </motion.div>
          </div>


        </div>
      </div>
    </PageTransition>
  );
}
