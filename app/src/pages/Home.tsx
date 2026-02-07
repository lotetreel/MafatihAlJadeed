import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/PageTransition';
import { CrescentDecoration } from '@/components/CrescentDecoration';
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Hand
} from 'lucide-react';

const sections = [
  {
    id: 'understanding',
    title: 'Understanding',
    subtitle: 'Shahr Ramadan',
    description: 'Discover the profound meaning of Ramadan through the Quran and teachings of Ahlul Bayt (as).',
    icon: BookOpen,
    path: '/understanding',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    id: 'aamal',
    title: 'Aamal & Dua',
    subtitle: 'Rituals & Supplications',
    description: 'Daily practices, prayers, and supplications drawn from authentic Shia sources.',
    icon: Hand,
    path: '/aamal-dua',
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    subtitle: 'Nights & Occasions',
    description: 'Key dates, religious occasions, and the blessed Nights of Decree (Laylat al-Qadr).',
    icon: CalendarDays,
    path: '/calendar',
    color: 'from-amber-500/20 to-amber-600/10',
  },
  {
    id: 'education',
    title: 'Education',
    subtitle: 'Fiqh & Akhlaq',
    description: 'Daily jurisprudence questions and ethical teachings to transform your character.',
    icon: GraduationCap,
    path: '/education',
    color: 'from-purple-500/20 to-purple-600/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export function Home() {
  return (
    <PageTransition>
      <div className="page-container relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
          {/* Crescent Decoration */}
          <div className="absolute right-[-5vw] top-[15vh] opacity-40 pointer-events-none">
            <CrescentDecoration size={300} />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto relative z-10"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Shahr Ramadan Digital Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              A Month of{' '}
              <span className="text-gradient-gold">Light</span>,{' '}
              <span className="text-gradient-gold">Mercy</span>, and{' '}
              <span className="text-gradient-gold">Transformation</span>
            </motion.h1>

            {/* Gold underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              className="w-24 h-0.5 bg-[hsl(var(--primary))] mx-auto mb-6"
            />

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
            >
              Daily guidance rooted in the Quran and the Ahlul Bayt (as).
              Choose your path and deepen your connection this Ramadan.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => {
                  document.getElementById('choose-your-path')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-4 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold transition-all hover:opacity-90 hover:scale-105 flex items-center gap-2"
              >
                Begin Your Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/calendar"
                className="px-8 py-4 rounded-xl border border-border/50 font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                Explore the Calendar
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-2"
            >
              <motion.div className="w-1 h-2 bg-muted-foreground rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Section Cards */}
        <section id="choose-your-path" className="py-20 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Explore the different sections of the platform, each designed to deepen your Ramadan experience.
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => (
                <motion.div key={section.id} variants={itemVariants}>
                  <Link to={section.path}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${section.color} backdrop-blur-sm p-6 h-full`}
                    >
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-card/80 flex items-center justify-center border border-border/50 mb-4 group-hover:border-[hsl(var(--primary))]/50 transition-colors">
                        <section.icon className="w-7 h-7 text-[hsl(var(--primary))]" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-[hsl(var(--primary))] font-medium mb-3">
                        {section.subtitle}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {section.description}
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))]">
                        <span>Explore</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* Decorative crescent */}
                      <div className="absolute -bottom-4 -right-4 opacity-10">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <path
                            d="M40 10 C55 10, 68 22, 68 40 C68 58, 55 70, 40 70 C52 70, 62 58, 62 40 C62 22, 52 10, 40 10"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Quote Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="glass-card p-8 md:p-12">
              <p className="arabic text-2xl md:text-3xl mb-6 leading-relaxed">
                شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ
              </p>
              <p className="text-lg text-muted-foreground italic mb-4">
                "The month of Ramadan in which was sent down the Quran,
                a guidance for mankind and clear proofs for the guidance..."
              </p>
              <p className="text-sm text-muted-foreground">— Al-Baqarah 2:185</p>
            </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}