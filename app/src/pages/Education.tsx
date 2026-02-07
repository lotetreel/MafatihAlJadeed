import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { fiqhPoints, akhlaqPoints } from '@/data/content';
import { 
  GraduationCap, 
  Scale, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Quote
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export function Education() {
  const [activeTab, setActiveTab] = useState<'fiqh' | 'akhlaq'>('fiqh');
  const [currentFiqhIndex, setCurrentFiqhIndex] = useState(0);
  const [currentAkhlaqIndex, setCurrentAkhlaqIndex] = useState(0);

  const currentFiqh = fiqhPoints[currentFiqhIndex];
  const currentAkhlaq = akhlaqPoints[currentAkhlaqIndex];

  const nextFiqh = () => {
    setCurrentFiqhIndex((prev) => (prev + 1) % fiqhPoints.length);
  };

  const prevFiqh = () => {
    setCurrentFiqhIndex((prev) => (prev - 1 + fiqhPoints.length) % fiqhPoints.length);
  };

  const nextAkhlaq = () => {
    setCurrentAkhlaqIndex((prev) => (prev + 1) % akhlaqPoints.length);
  };

  const prevAkhlaq = () => {
    setCurrentAkhlaqIndex((prev) => (prev - 1 + akhlaqPoints.length) % akhlaqPoints.length);
  };

  return (
    <PageTransition>
      <div className="page-container relative pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Daily Learning
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Daily Education
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Small lessons, consistent change. Deepen your understanding of Islamic 
              jurisprudence and transform your character through daily ethical teachings.
            </p>
            <div className="w-20 h-0.5 bg-[hsl(var(--primary))] mt-6" />
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/50 border border-border/50 w-fit mx-auto">
              <button
                onClick={() => setActiveTab('fiqh')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'fiqh'
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Scale className="w-5 h-5" />
                <span>Daily Fiqhi Point</span>
              </button>
              <button
                onClick={() => setActiveTab('akhlaq')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'akhlaq'
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Point of Akhlaq</span>
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'fiqh' ? (
              <motion.div
                key="fiqh"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                  {/* Decorative */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Scale className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Daily Fiqhi Question
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Day {currentFiqh.day}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFiqhIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">
                        {currentFiqh.question}
                      </h2>

                      <div className="p-6 rounded-xl bg-secondary/50 border border-border/50 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-[hsl(var(--primary))]" />
                          <span className="text-sm font-semibold text-muted-foreground">Answer</span>
                        </div>
                        <p className="leading-relaxed">
                          {currentFiqh.answer}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Source:</span> {currentFiqh.source}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                    <button
                      onClick={prevFiqh}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="text-sm">Previous</span>
                    </button>

                    <div className="flex gap-2">
                      {fiqhPoints.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentFiqhIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentFiqhIndex
                              ? 'w-6 bg-[hsl(var(--primary))]'
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextFiqh}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <span className="text-sm">Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="akhlaq"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                  {/* Decorative */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-purple-500 to-purple-500/50" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Point of Akhlaq
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Day {currentAkhlaq.day}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAkhlaqIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">
                        {currentAkhlaq.title}
                      </h2>

                      <div className="p-6 rounded-xl bg-secondary/50 border border-border/50 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Quote className="w-4 h-4 text-[hsl(var(--primary))]" />
                          <span className="text-sm font-semibold text-muted-foreground">Teaching</span>
                        </div>
                        <p className="italic text-lg leading-relaxed mb-3">
                          "{currentAkhlaq.quote}"
                        </p>
                        <p className="text-sm text-muted-foreground">
                          — {currentAkhlaq.source}
                        </p>
                      </div>

                      <div className="p-6 rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-[hsl(var(--primary))]" />
                          <span className="text-sm font-semibold text-[hsl(var(--primary))]">Reflection</span>
                        </div>
                        <p className="leading-relaxed">
                          {currentAkhlaq.reflection}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                    <button
                      onClick={prevAkhlaq}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="text-sm">Previous</span>
                    </button>

                    <div className="flex gap-2">
                      {akhlaqPoints.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAkhlaqIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentAkhlaqIndex
                              ? 'w-6 bg-[hsl(var(--primary))]'
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextAkhlaq}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <span className="text-sm">Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Info Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">About Fiqh</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fiqh (Islamic jurisprudence) provides practical guidance on how to live 
                according to Islamic principles. Our daily fiqhi points address common 
                questions about worship, daily life, and Ramadan-specific rulings based 
                on Shia scholarship.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold">About Akhlaq</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Akhlaq (Islamic ethics) focuses on character development and moral excellence. 
                The teachings of the Ahlul Bayt (as) provide profound guidance on cultivating 
                virtues like patience, generosity, humility, and forgiveness.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}