import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';

interface SwipeableItemProps {
  isCompleted: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const SWIPE_THRESHOLD = 80;

export function SwipeableItem({
  isCompleted,
  onToggle,
  children,
  className = '',
  onClick
}: SwipeableItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Transform values for the background reveal
  const backgroundOpacity = useTransform(
    x,
    [-SWIPE_THRESHOLD, -20, 0, 20, SWIPE_THRESHOLD],
    [1, 0.2, 0, 0.2, 1]
  );

  const backgroundScale = useTransform(
    x,
    [-SWIPE_THRESHOLD, -50, 0, 50, SWIPE_THRESHOLD],
    [1, 0.8, 0.6, 0.8, 1]
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    // Swipe right to complete, left to uncomplete (or toggle both ways)
    if (info.offset.x > SWIPE_THRESHOLD && !isCompleted) {
      onToggle();
    } else if (info.offset.x < -SWIPE_THRESHOLD && isCompleted) {
      onToggle();
    }
  };

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-xl">
      {/* Background layer - revealed on swipe */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-between px-6 rounded-xl ${isCompleted
          ? 'bg-amber-500/20'
          : 'bg-emerald-500/20'
          }`}
        style={{ opacity: backgroundOpacity }}
      >
        <motion.div
          className={`flex items-center gap-2 ${isCompleted ? 'text-amber-400' : 'text-emerald-400'}`}
          style={{ scale: backgroundScale }}
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm font-medium">Swipe to undo</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Swipe to complete</span>
            </>
          )}
        </motion.div>

        <motion.div
          className={`flex items-center gap-2 ${isCompleted ? 'text-amber-400' : 'text-emerald-400'}`}
          style={{ scale: backgroundScale }}
        >
          {isCompleted ? (
            <>
              <span className="text-sm font-medium">Swipe to undo</span>
              <RotateCcw className="w-5 h-5" />
            </>
          ) : (
            <>
              <span className="text-sm font-medium">Swipe to complete</span>
              <Check className="w-5 h-5" />
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Foreground card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (!isDragging && onClick) {
            onClick();
          }
        }}
        style={{ x }}
        animate={{
          x: 0,
          scale: isCompleted ? 0.98 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`relative bg-card ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
      >
        {/* Completed indicator stripe */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Check button - desktop friendly */}
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted
              ? 'bg-emerald-500 text-white'
              : 'bg-secondary hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400'
              }`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="incomplete"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-4 h-4 rounded-full border-2 border-current"
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Content wrapper with completion visual effect */}
        <div className={`transition-all duration-300 ${isCompleted ? 'pl-3' : 'pl-0'}`}>
          {/* Strikethrough overlay for text content */}
          {isCompleted && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{ originX: 0 }}
            >
              <div className="absolute top-1/2 left-6 right-16 h-px bg-emerald-500/50" />
            </motion.div>
          )}

          {children}
        </div>

        {/* Completion badge */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 right-4"
            >
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                Completed
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
