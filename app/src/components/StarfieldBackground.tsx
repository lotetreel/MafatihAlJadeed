import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export function StarfieldBackground() {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {isLightMode ? (
        /* Light mode: Sky and clouds */
        <>
          {/* Blue sky background - solid and visible */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #87CEEB 0%, #B0E2FF 25%, #D4EFFF 50%, #EDF8FF 75%, #F8F5F0 100%)',
            }}
          />

          {/* Sun glow */}
          <motion.div
            className="absolute top-12 right-16 w-28 h-28"
            style={{
              background: 'radial-gradient(circle, rgba(255, 245, 200, 1) 0%, rgba(255, 220, 100, 0.7) 30%, rgba(255, 180, 60, 0.3) 60%, transparent 80%)',
              borderRadius: '50%',
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Fluffy clouds - much more visible */}
          <motion.div
            className="absolute top-[6%] left-[2%]"
            style={{
              width: '280px',
              height: '120px',
              background: `
                radial-gradient(ellipse 70px 60px at 25% 60%, white 0%, rgba(255,255,255,0.95) 50%, transparent 70%),
                radial-gradient(ellipse 90px 70px at 50% 40%, white 0%, rgba(255,255,255,0.98) 50%, transparent 70%),
                radial-gradient(ellipse 75px 55px at 75% 55%, white 0%, rgba(255,255,255,0.95) 50%, transparent 70%),
                radial-gradient(ellipse 60px 50px at 85% 65%, white 0%, rgba(255,255,255,0.9) 50%, transparent 70%)
              `,
              filter: 'blur(1px)',
            }}
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute top-[12%] right-[5%]"
            style={{
              width: '240px',
              height: '100px',
              background: `
                radial-gradient(ellipse 65px 55px at 30% 55%, white 0%, rgba(255,255,255,0.95) 50%, transparent 70%),
                radial-gradient(ellipse 80px 65px at 55% 45%, white 0%, rgba(255,255,255,0.98) 50%, transparent 70%),
                radial-gradient(ellipse 70px 50px at 80% 60%, white 0%, rgba(255,255,255,0.92) 50%, transparent 70%)
              `,
              filter: 'blur(1px)',
            }}
            animate={{ x: [0, -40, 0] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute top-[22%] left-[20%]"
            style={{
              width: '320px',
              height: '130px',
              background: `
                radial-gradient(ellipse 80px 65px at 20% 55%, white 0%, rgba(255,255,255,0.96) 50%, transparent 70%),
                radial-gradient(ellipse 100px 80px at 45% 40%, white 0%, rgba(255,255,255,0.98) 50%, transparent 70%),
                radial-gradient(ellipse 85px 60px at 70% 55%, white 0%, rgba(255,255,255,0.95) 50%, transparent 70%),
                radial-gradient(ellipse 65px 50px at 90% 60%, white 0%, rgba(255,255,255,0.9) 50%, transparent 70%)
              `,
              filter: 'blur(1px)',
            }}
            animate={{ x: [0, 60, 0] }}
            transition={{ duration: 55, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute top-[8%] left-[50%]"
            style={{
              width: '200px',
              height: '90px',
              background: `
                radial-gradient(ellipse 60px 50px at 30% 55%, white 0%, rgba(255,255,255,0.95) 50%, transparent 70%),
                radial-gradient(ellipse 75px 60px at 60% 45%, white 0%, rgba(255,255,255,0.97) 50%, transparent 70%),
                radial-gradient(ellipse 55px 45px at 85% 55%, white 0%, rgba(255,255,255,0.93) 50%, transparent 70%)
              `,
              filter: 'blur(1px)',
            }}
            animate={{ x: [0, -45, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        /* Dark/Sepia mode: Starfield */
        <>
          {/* Nebula effects */}
          <motion.div
            className="absolute top-0 right-0 w-[60vw] h-[60vh] opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 70% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute bottom-0 left-0 w-[50vw] h-[50vh] opacity-15"
            style={{
              background: 'radial-gradient(ellipse at 30% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 55%)',
            }}
            animate={{
              scale: [1, 1.03, 1],
              opacity: [0.1, 0.18, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Starfield pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.4), transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.3), transparent),
                radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.35), transparent),
                radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.25), transparent),
                radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.3), transparent),
                radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.2), transparent),
                radial-gradient(1px 1px at 50px 200px, rgba(255,255,255,0.25), transparent),
                radial-gradient(2px 2px at 120px 250px, rgba(255,255,255,0.2), transparent),
                radial-gradient(1px 1px at 280px 180px, rgba(255,255,255,0.3), transparent),
                radial-gradient(2px 2px at 350px 100px, rgba(255,255,255,0.25), transparent)
              `,
              backgroundSize: '400px 300px',
            }}
          />

          {/* Twinkling stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}