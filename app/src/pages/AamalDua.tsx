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
  Clock3,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Drawer } from 'vaul';

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

  const [isLevelDrawerOpen, setIsLevelDrawerOpen] = useState(false);
  const [isTimeDrawerOpen, setIsTimeDrawerOpen] = useState(false);

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
            {/* Level badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${item.level === 1 ? 'bg-emerald-500/20 text-emerald-400' :
              item.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
              L{item.level}
            </span>
          </div>
        </div>

        <h3 className="text-base font-semibold mb-0.5 leading-tight">{item.name}</h3>
        <p className="arabic text-sm text-muted-foreground mb-4">{item.arabicName}</p>

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
            {/* Mobile Filter Buttons */}
            <div className="lg:hidden flex gap-3 mb-2 sticky top-24 z-20 bg-background/80 backdrop-blur-md py-3 -mt-6 border-b border-border/50">
              {(() => {
                const config = {
                  1: { name: 'Essential', color: 'emerald', icon: '✦' },
                  2: { name: 'Striver', color: 'blue', icon: '★' },
                  3: { name: 'Wayfarer', color: 'amber', icon: '♔' },
                }[maxLevel as 1 | 2 | 3];

                return (
                  <button
                    onClick={() => setIsLevelDrawerOpen(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors shadow-sm
                      ${maxLevel === 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' :
                        maxLevel === 2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20' :
                          'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'}`}
                  >
                    <span>{config.icon}</span>
                    {config.name}
                  </button>
                );
              })()}

              <button
                onClick={() => setIsTimeDrawerOpen(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors relative shadow-sm
                  ${selectedTimings.length > 0
                    ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20'
                    : 'bg-secondary/80 border-border/50 hover:bg-secondary text-foreground'}`}
              >
                <Filter className="w-4 h-4" />
                {selectedTimings.length > 0 ? `${selectedTimings.length} Selected` : 'Any Time'}
              </button>
            </div>

            {/* Sidebar (Left Column) - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0 space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar pb-10"
            >
              {/* Practice Level */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-1">Practice Level</h3>
                <div className="flex flex-col gap-1.5">
                  {([1, 2, 3] as const).map((level) => {
                    const config = {
                      1: { name: 'Essential', color: 'emerald', icon: '✦', desc: 'Core practices' },
                      2: { name: 'Striver', color: 'blue', icon: '★', desc: 'Recommended additions' },
                      3: { name: 'Wayfarer', color: 'amber', icon: '♔', desc: 'Comprehensive path' },
                    }[level];

                    const isActive = maxLevel >= level;
                    const isSelected = maxLevel === level;

                    return (
                      <button
                        key={level}
                        onClick={() => setMaxLevel(level)}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${isSelected
                          ? `border`
                          : isActive
                            ? 'bg-secondary/40 text-foreground hover:bg-secondary border border-border/30'
                            : 'bg-transparent text-muted-foreground hover:bg-secondary/50 border border-transparent'
                          }`}
                        style={isSelected ? {
                          backgroundColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' :
                            config.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                              'rgba(245, 158, 11, 0.1)',
                          color: config.color === 'emerald' ? 'rgb(52, 211, 153)' :
                            config.color === 'blue' ? 'rgb(96, 165, 250)' :
                              'rgb(251, 191, 36)',
                          borderColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.3)' :
                            config.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                              'rgba(245, 158, 11, 0.3)',
                        } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${isSelected ? 'scale-110' : 'opacity-70 group-hover:opacity-100'} transition-all`}>{config.icon}</span>
                          <div className="flex flex-col items-start leading-tight">
                            <span>{config.name}</span>
                            {isSelected && <span className="text-[10px] opacity-70 font-normal mt-0.5">{config.desc}</span>}
                          </div>
                        </div>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timing Filters Bar */}
              {availableTimings.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-1">Filter by Time</h3>
                  <div className="flex flex-col gap-1.5">
                    {availableTimings.map(timing => {
                      const isSelected = selectedTimings.includes(timing);
                      return (
                        <button
                          key={timing}
                          onClick={() => toggleTimingFilter(timing)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full ${isSelected
                            ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30'
                            : 'bg-transparent text-muted-foreground hover:bg-secondary/50 border border-transparent hover:border-border/30'
                            }`}
                        >
                          <span className={`${isSelected ? 'opacity-100' : 'opacity-60'} transition-opacity`}>
                            {getTimingIcon(timing)}
                          </span>
                          <span className="text-left leading-tight">{timing}</span>
                        </button>
                      );
                    })}

                    {/* Clear Filters Button */}
                    {selectedTimings.length > 0 && (
                      <button
                        onClick={() => setSelectedTimings([])}
                        className="mt-2 text-xs font-medium text-muted-foreground hover:text-[hsl(var(--primary))] transition-colors w-full text-left ml-4 flex items-center gap-1.5"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              )}
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">
                      Practices
                    </h2>
                    <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
                      {filteredItems.length}
                    </span>
                  </div>
                </div>
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
                className="text-center text-sm text-muted-foreground mt-8 hidden lg:block"
              >
                💡 Tip: Swipe right to mark as complete, or click the check button
              </motion.p>

              {/* Mobile Mobile Drawers */}
              <style>{`
                [data-vaul-drawer] { border-radius: 24px 24px 0 0; }
                [data-vaul-drawer]::after { display: none; }
              `}</style>

              {/* Practice Level Drawer */}
              <Drawer.Root open={isLevelDrawerOpen} onOpenChange={setIsLevelDrawerOpen}>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setIsLevelDrawerOpen(false)} />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[24px] mt-24 fixed bottom-0 left-0 right-0 z-50 p-6 pb-12 outline-none border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)]">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Practice Level</h3>
                      <button onClick={() => setIsLevelDrawerOpen(false)} className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {([1, 2, 3] as const).map((level) => {
                        const config = {
                          1: { name: 'Essential', color: 'emerald', icon: '✦', desc: 'Core practices for everyday' },
                          2: { name: 'Striver', color: 'blue', icon: '★', desc: 'Recommended additional aamal' },
                          3: { name: 'Wayfarer', color: 'amber', icon: '♔', desc: 'Comprehensive spiritual path' },
                        }[level];

                        const isActive = maxLevel >= level;
                        const isSelected = maxLevel === level;

                        return (
                          <button
                            key={level}
                            onClick={() => {
                              setMaxLevel(level);
                              setTimeout(() => setIsLevelDrawerOpen(false), 200);
                            }}
                            className={`w-full px-5 py-4 rounded-2xl text-base font-medium transition-all duration-200 flex items-center justify-between group ${isSelected
                              ? `border shadow-sm`
                              : isActive
                                ? 'bg-secondary/50 text-foreground hover:bg-secondary border border-border/30'
                                : 'bg-transparent text-muted-foreground hover:bg-secondary/50 border border-transparent'
                              }`}
                            style={isSelected ? {
                              backgroundColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' :
                                config.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                                  'rgba(245, 158, 11, 0.1)',
                              color: config.color === 'emerald' ? 'rgb(52, 211, 153)' :
                                config.color === 'blue' ? 'rgb(96, 165, 250)' :
                                  'rgb(251, 191, 36)',
                              borderColor: config.color === 'emerald' ? 'rgba(16, 185, 129, 0.3)' :
                                config.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' :
                                  'rgba(245, 158, 11, 0.3)',
                            } : {}}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`text-xl ${isSelected ? 'scale-110' : 'opacity-70'} transition-transform`}>{config.icon}</span>
                              <div className="flex flex-col items-start leading-tight">
                                <span className="font-semibold">{config.name}</span>
                                <span className="text-xs opacity-70 font-normal mt-1">{config.desc}</span>
                              </div>
                            </div>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: 'currentColor' }} />}
                          </button>
                        );
                      })}
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>

              {/* Timing Filter Drawer */}
              <Drawer.Root open={isTimeDrawerOpen} onOpenChange={setIsTimeDrawerOpen}>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setIsTimeDrawerOpen(false)} />
                  <Drawer.Content className="bg-background flex flex-col rounded-t-[24px] mt-24 fixed bottom-0 left-0 right-0 z-50 p-6 pb-12 outline-none border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)]">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Filter by Time</h3>
                      <div className="flex items-center gap-2">
                        {selectedTimings.length > 0 && (
                          <button
                            onClick={() => setSelectedTimings([])}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                        <button onClick={() => setIsTimeDrawerOpen(false)} className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto no-scrollbar pb-2">
                      {availableTimings.map(timing => {
                        const isSelected = selectedTimings.includes(timing);
                        return (
                          <button
                            key={timing}
                            onClick={() => toggleTimingFilter(timing)}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-medium transition-all duration-200 w-full ${isSelected
                              ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 shadow-sm'
                              : 'bg-secondary/40 text-muted-foreground hover:bg-secondary border border-border/30'
                              }`}
                          >
                            <span className={`${isSelected ? 'opacity-100' : 'opacity-60'} transition-opacity p-2 rounded-xl ${isSelected ? 'bg-[hsl(var(--primary))]/20' : 'bg-secondary/80'}`}>
                              {getTimingIcon(timing)}
                            </span>
                            <span className="text-left flex-1 font-semibold">{timing}</span>

                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]' : 'border-muted-foreground/30'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* View Results Button */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <button
                        onClick={() => setIsTimeDrawerOpen(false)}
                        className="w-full py-4 rounded-xl bg-[hsl(var(--primary))] text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        View Results
                        {selectedTimings.length > 0 && (
                          <span className="bg-primary-foreground/20 px-2 py-0.5 rounded-md text-sm">
                            {selectedTimings.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </motion.div>
          </div>


        </div>
      </div>
    </PageTransition>
  );
}
