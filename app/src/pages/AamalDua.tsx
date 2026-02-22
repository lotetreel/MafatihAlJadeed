import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { SwipeableItem } from '@/components/SwipeableItem';

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
  ChevronDown,
  Sunrise,
  Sunset,
  Sparkles,
  Clock3
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
  timing?: string[];
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
  // Filter state
  const [selectedTimings, setSelectedTimings] = useState<string[]>([]);

  // maxLevel is cumulative - shows all items from level 1 up to maxLevel
  const [maxLevel, setMaxLevel] = useState<number>(() => {
    const saved = localStorage.getItem('user_level');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem('user_level', maxLevel.toString());
  }, [maxLevel]);

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

  // Filter items based on level
  const filteredItems = useMemo(() => {
    return allItems.filter(item => item.level <= maxLevel);
  }, [allItems, maxLevel]);

  // Separate for stats display
  // Extract unique timing tags from all available items
  const availableTimings = useMemo(() => {
    const timings = new Set<string>();
    filteredItems.forEach(item => {
      if (item.timing && Array.isArray(item.timing)) {
        item.timing.forEach(t => timings.add(t));
      }
    });

    // Sort them in a logical daily order if possible, otherwise alphabetically
    const logicalOrder = ["Suhoor", "Days of Shahr Ramadhan", "Iftar", "After Every Obligatory Prayer", "Nights of Shahr Ramadan"];
    return Array.from(timings).sort((a, b) => {
      const indexA = logicalOrder.indexOf(a);
      const indexB = logicalOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [filteredItems]);

  const toggleTimingFilter = (timing: string) => {
    setSelectedTimings(prev =>
      prev.includes(timing)
        ? []
        : [timing]
    );
  };

  // Group items by their timing (for the grouped view)
  const groupedItems = useMemo(() => {
    const groups: Record<string, CombinedItem[]> = {};

    // Create an "Untagged" group for items without timing
    const untagged: CombinedItem[] = [];

    filteredItems.forEach(item => {
      // If filters are active, only include items that match the selected filters
      if (selectedTimings.length > 0) {
        if (!item.timing || !Array.isArray(item.timing) || !item.timing.some(t => selectedTimings.includes(t))) {
          return; // Skip this item as it doesn't match selected filters
        }
      }

      if (!item.timing || !Array.isArray(item.timing) || item.timing.length === 0) {
        untagged.push(item);
      } else {
        item.timing.forEach(t => {
          // If filters are active, only add to the groups that are selected
          if (selectedTimings.length > 0 && !selectedTimings.includes(t)) {
            return;
          }
          if (!groups[t]) groups[t] = [];
          if (!groups[t].find(i => i.id === item.id)) {
            groups[t].push(item);
          }
        });
      }
    });

    // If grouping, sort the items inside each group by global order
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const indexA = contentOrder.indexOf(a.id);
        const indexB = contentOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.type === 'aamal' ? -1 : 1;
      });
    });

    return { groups, untagged };
  }, [filteredItems, selectedTimings]);

  // Helper to get an icon for common timings
  const getTimingIcon = (timing: string) => {
    const lowered = timing.toLowerCase();
    if (lowered.includes('suhoor')) return <Sunrise className="w-5 h-5 text-amber-500" />;
    if (lowered.includes('iftar')) return <Sunset className="w-5 h-5 text-orange-500" />;
    if (lowered.includes('night')) return <Moon className="w-5 h-5 text-indigo-400" />;
    if (lowered.includes('day')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (lowered.includes('prayer')) return <Clock3 className="w-5 h-5 text-emerald-500" />;
    return <Sparkles className="w-5 h-5 text-primary" />;
  };

  // Helper component to render a single item card
  const renderItemCard = (item: CombinedItem) => (
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
        className="glass-card p-5 hover-lift group cursor-pointer h-full flex flex-col"
        onClick={() => navigate(`/aamal-dua/${item.id}`)}
      >
        <div className="flex items-start justify-between mb-3 pr-10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'dua'
            ? 'bg-indigo-500/20'
            : 'bg-amber-500/20'
            }`}>
            {item.type === 'dua' ? (
              <BookOpen className="w-5 h-5 text-indigo-400" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5 ml-2">
            {/* Day-specific badge */}
            {item.applicableDays !== 'all' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] whitespace-nowrap">
                Day {item.applicableDays.join(', ')}
              </span>
            )}
            {/* Type badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.type === 'dua'
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'bg-amber-500/20 text-amber-400'
              }`}>
              {item.type === 'dua' ? 'Dua' : "A'mal"}
            </span>
            {/* Level badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.level === 1 ? 'bg-emerald-500/20 text-emerald-400' :
              item.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
              L{item.level}
            </span>
          </div>
        </div>

        <h3 className="text-base font-semibold mb-0.5">{item.name}</h3>
        <p className="arabic text-sm text-muted-foreground mb-3">{item.arabicName}</p>

        {/* Show timing for a'amal */}
        {'timing' in item && item.timing && Array.isArray(item.timing) && item.timing.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {item.timing.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/80 text-xs text-muted-foreground border border-border/50">
                <Clock3 className="w-3 h-3 opacity-70" />
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex-grow">
          <ExpandableDescription text={item.description} />
        </div>

        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-end shrink-0">
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] font-medium">
            <span>View Full Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </SwipeableItem>
    </motion.div>
  );

  const logicalOrderKeys = ["Suhoor", "Days of Shahr Ramadhan", "Iftar", "After Every Obligatory Prayer", "Nights of Shahr Ramadan"];
  const sortedGroupKeys = Object.keys(groupedItems.groups).sort((a, b) => {
    const indexA = logicalOrderKeys.indexOf(a);
    const indexB = logicalOrderKeys.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const isFilteredEmpty = Object.keys(groupedItems.groups).length === 0 && groupedItems.untagged.length === 0;





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




            </motion.div>

            {/* Right Column - Items Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1"
            >
              {/* Section header and Timing Filters */}
              <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">
                      Practices
                    </h2>
                    <p className="text-muted-foreground">
                      Showing {filteredItems.length} {filteredItems.length === 1 ? 'practice' : 'practices'}
                    </p>
                  </div>

                  {/* Quick stats */}
                  <div className="flex gap-4 text-sm bg-secondary/30 px-4 py-2 rounded-xl border border-border/40">
                    <div className="flex items-center gap-2 font-medium">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>{filteredItems.filter(i => i.type === 'aamal').length} A'amal</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>{filteredItems.filter(i => i.type === 'dua').length} Duas</span>
                    </div>
                  </div>
                </div>

                {/* Timing Filters Bar */}
                {availableTimings.length > 0 && (
                  <div className="p-1 mb-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 ml-1">Filter by Time</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTimings.map(timing => {
                        const isSelected = selectedTimings.includes(timing);
                        return (
                          <button
                            key={timing}
                            onClick={() => toggleTimingFilter(timing)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isSelected
                              ? 'bg-[hsl(var(--primary))] text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                              : 'bg-secondary/60 text-muted-foreground hover:bg-secondary border border-border/40 hover:border-border'
                              }`}
                          >
                            <span className={isSelected ? 'text-primary-foreground' : ''}>
                              {getTimingIcon(timing)}
                            </span>
                            {timing}
                          </button>
                        );
                      })}

                      {/* Clear Filters Button */}
                      {selectedTimings.length > 0 && (
                        <button
                          onClick={() => setSelectedTimings([])}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Groups */}
              <AnimatePresence mode="popLayout">
                {!isFilteredEmpty ? (
                  <div className="space-y-12">
                    {/* Render Grouped Items */}
                    {sortedGroupKeys.map(timing => (
                      <motion.div
                        key={timing}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3 border-b border-border/40 pb-2">
                          <div className="p-2 rounded-lg bg-secondary/50 shadow-sm border border-border/30">
                            {getTimingIcon(timing)}
                          </div>
                          <h3 className="text-xl font-semibold">{timing}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground ml-auto">
                            {groupedItems.groups[timing].length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          <AnimatePresence mode="popLayout">
                            {groupedItems.groups[timing].map(renderItemCard)}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}

                    {/* Render Untagged Items */}
                    {groupedItems.untagged.length > 0 && (
                      <motion.div
                        key="untagged"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3 border-b border-border/40 pb-2">
                          <div className="p-2 rounded-lg bg-secondary/50 shadow-sm border border-border/30">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold opacity-80">Other Practices</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground ml-auto">
                            {groupedItems.untagged.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          <AnimatePresence mode="popLayout">
                            {groupedItems.untagged.map(renderItemCard)}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </div>
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
                      No practices at this level
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try selecting a different level to see more practices.
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
