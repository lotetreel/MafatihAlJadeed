import { motion } from 'framer-motion';

export function StarfieldBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
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
    </div>
  );
}