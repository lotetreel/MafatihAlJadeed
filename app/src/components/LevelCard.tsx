import { motion } from 'framer-motion';
import { Check, Layers } from 'lucide-react';
import { levels } from '@/data/content';

type LevelKey = 1 | 2 | 3;

interface LevelCardProps {
  level: LevelKey;
  isActive: boolean;  // Whether this level is included in the current filter (<= maxLevel)
  isSelected: boolean; // Whether this is the exact level selected
  onClick: () => void;
}

const levelColors = {
  1: {
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: '✦',
  },
  2: {
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '★',
  },
  3: {
    gradient: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    icon: '♔',
  },
};

export function LevelCard({ level, isActive, isSelected, onClick }: LevelCardProps) {
  const levelData = levels[level];
  const colors = levelColors[level];

  return (
    <motion.button
      onClick={onClick}
      className={`w-full relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 text-left
        ${isActive 
          ? `${colors.border} bg-gradient-to-br ${colors.gradient} shadow-lg` 
          : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
        }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 transition-all
            ${isActive 
              ? `${colors.bg} ${colors.border} scale-110` 
              : 'bg-card/50 border-border/50'
            }`}
          >
            {colors.icon}
          </div>
          
          {/* Text */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider transition-colors
                ${isActive ? colors.text : 'text-muted-foreground'}`}
              >
                Level {level}
              </span>
              {isActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-xs ${colors.text}`}
                >
                  <Check className="w-3 h-3 inline" />
                </motion.span>
              )}
            </div>
            <h3 className={`text-xl font-semibold mt-0.5 transition-colors
              ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {levelData.name}
            </h3>
            {isSelected && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-muted-foreground mt-1 max-w-md"
              >
                {levelData.description}
              </motion.p>
            )}
          </div>
        </div>

        {/* Selection indicator */}
        <div className={`flex items-center gap-3 ${isActive ? colors.text : 'text-muted-foreground'}`}>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                L1{level >= 2 && '-L2'}{level >= 3 && '-L3'}
              </span>
            </motion.div>
          )}
          
          {/* Check circle */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
            ${isActive 
              ? `${colors.bg} ${colors.border}` 
              : 'border-border/50 bg-card/50'
            }`}
          >
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className={`w-4 h-4 ${colors.text}`} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar at bottom showing this level's selection */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg.replace('/20', '/50')}`}
          style={{ originX: 0 }}
        />
      )}
    </motion.button>
  );
}
