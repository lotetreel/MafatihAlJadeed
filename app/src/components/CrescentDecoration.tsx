import { motion } from 'framer-motion';

interface CrescentDecorationProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export function CrescentDecoration({ 
  className = '', 
  size = 200,
  animate = true 
}: CrescentDecorationProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${className}`}
      initial={animate ? { opacity: 0, rotate: -10, scale: 0.9 } : false}
      animate={animate ? { 
        opacity: 1, 
        rotate: 0, 
        scale: 1,
        y: [0, -10, 0]
      } : false}
      transition={animate ? {
        opacity: { duration: 1, ease: 'easeOut' },
        rotate: { duration: 1, ease: 'easeOut' },
        scale: { duration: 1, ease: 'easeOut' },
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
      } : undefined}
    >
      <defs>
        <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4A843" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M100 20 C140 20, 170 55, 170 100 C170 145, 140 180, 100 180 C130 180, 155 145, 155 100 C155 55, 130 20, 100 20"
        fill="none"
        stroke="url(#crescentGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}