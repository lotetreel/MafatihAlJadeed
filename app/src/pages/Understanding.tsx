import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { CrescentDecoration } from '@/components/CrescentDecoration';
import { understandingRamadan } from '@/data/content';
import { BookOpen, Quote } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
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

export function Understanding() {
  return (
    <PageTransition>
      <div className="page-container relative pt-24 pb-20">
        {/* Decorative Elements */}
        <div className="absolute right-[-10vw] top-[20vh] opacity-30 pointer-events-none">
          <CrescentDecoration size={400} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Understanding
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {understandingRamadan.title}
            </motion.h1>

            <motion.div 
              variants={itemVariants}
              className="w-20 h-0.5 bg-[hsl(var(--primary))] mb-8"
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mb-4 text-[hsl(var(--primary))]">
                  {understandingRamadan.subtitle}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {understandingRamadan.introduction}
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-4">The Triple Movement</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {understandingRamadan.sheikhNasserResearch}
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Quote className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Hadith
                  </span>
                </div>
                <p className="italic text-muted-foreground mb-4">
                  "{understandingRamadan.hadith.text}"
                </p>
                <p className="text-sm text-muted-foreground">
                  — {understandingRamadan.hadith.source}
                </p>
              </motion.div>
            </div>

            {/* Right Column - Quranic Verse Card */}
            <motion.div variants={itemVariants} className="lg:sticky lg:top-28 lg:self-start">
              <div className="glass-card p-8 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--primary))] rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-[hsl(var(--primary))]">Q</span>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Quranic Verse
                    </span>
                  </div>

                  <p className="arabic text-2xl md:text-3xl leading-relaxed mb-6 text-right">
                    {understandingRamadan.quranicVerse.arabic}
                  </p>

                  <div className="w-full h-px bg-border/50 mb-6" />

                  <p className="text-muted-foreground italic leading-relaxed mb-4">
                    "{understandingRamadan.quranicVerse.translation}"
                  </p>

                  <p className="text-sm text-muted-foreground">
                    — {understandingRamadan.quranicVerse.reference}
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <motion.div 
                variants={itemVariants}
                className="glass-card p-6 mt-6"
              >
                <h4 className="font-semibold mb-4">Key Concepts</h4>
                <ul className="space-y-3">
                  {[
                    { term: 'Tazkiyah', desc: 'Purification of the soul' },
                    { term: 'Muraqabah', desc: 'Spiritual presence and mindfulness' },
                    { term: 'Khidmah', desc: 'Service to others' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{item.term}</span>
                        <span className="text-muted-foreground text-sm"> — {item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom Section - Deepening Understanding */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl font-semibold mb-8 text-center"
            >
              Deepening Your Understanding
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Fasting with the Limbs',
                  description: 'Beyond abstaining from food and drink, guard your eyes, ears, tongue, and limbs from what displeases Allah.',
                },
                {
                  title: 'The Covenant of Nearness',
                  description: 'Ramadan is a direct invitation from Allah to draw closer to Him through worship and devotion.',
                },
                {
                  title: 'Turning to Ahlul Bayt',
                  description: 'The teachings of the Prophet and his Holy Household illuminate the path of true fasting.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/20 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-[hsl(var(--primary))]">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}