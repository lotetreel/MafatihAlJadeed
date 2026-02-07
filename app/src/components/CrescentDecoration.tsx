import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

  // Don't render moon in light mode
  if (theme === 'light') {
    return null;
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={false}
      animate={animate ? {
        y: [0, -8, 0]
      } : false}
      transition={animate ? {
        y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
      } : undefined}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 245, 200, 0.3) 0%, rgba(255, 220, 150, 0.15) 40%, transparent 70%)',
          transform: 'scale(1.5)',
          filter: 'blur(20px)',
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 250, 220, 0.4) 0%, rgba(255, 230, 180, 0.2) 50%, transparent 75%)',
          transform: 'scale(1.2)',
          filter: 'blur(10px)',
        }}
      />

      {/* Main moon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="relative z-10"
      >
        <defs>
          {/* Moon gradient */}
          <radialGradient id="moonGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="30%" stopColor="#FFF8E7" />
            <stop offset="60%" stopColor="#F5E6C8" />
            <stop offset="100%" stopColor="#E8D4A8" />
          </radialGradient>

          {/* Crater shadow gradient */}
          <radialGradient id="craterGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(200, 180, 150, 0.3)" />
            <stop offset="100%" stopColor="rgba(180, 160, 130, 0.15)" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Moon circle */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="url(#moonGradient)"
          filter="url(#moonGlow)"
        />

        {/* Subtle craters for realism */}
        <ellipse cx="75" cy="85" rx="12" ry="10" fill="url(#craterGradient)" opacity="0.5" />
        <ellipse cx="120" cy="70" rx="8" ry="7" fill="url(#craterGradient)" opacity="0.4" />
        <ellipse cx="90" cy="120" rx="15" ry="12" fill="url(#craterGradient)" opacity="0.35" />
        <ellipse cx="130" cy="110" rx="10" ry="8" fill="url(#craterGradient)" opacity="0.4" />
        <ellipse cx="60" cy="115" rx="6" ry="5" fill="url(#craterGradient)" opacity="0.3" />
        <ellipse cx="110" cy="145" rx="9" ry="7" fill="url(#craterGradient)" opacity="0.35" />
      </svg>
    </motion.div>
  );
}