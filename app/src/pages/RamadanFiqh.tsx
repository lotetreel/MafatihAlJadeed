import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { fiqhQA } from '@/data/content';
import {
    Scale,
    ChevronDown,
    BookOpen,
    AlertTriangle,
    Info,
    ExternalLink,
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
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

export function RamadanFiqh() {
    const [expandedId, setExpandedId] = useState<string | null>(fiqhQA[0]?.id ?? null);

    const toggleExpand = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    return (
        <PageTransition>
            <div className="page-container relative pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                                <Scale className="w-6 h-6 text-[hsl(var(--primary))]" />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Month of Ramadhan
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Fiqh on Fasting
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            A practical Q&A guide on the jurisprudence of fasting during the
                            holy month of Ramadhan, covering common questions and rulings.
                        </p>
                        <div className="w-20 h-0.5 bg-[hsl(var(--primary))] mt-6" />
                    </motion.div>

                    {/* Q&A Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {fiqhQA.map((item, index) => {
                            const isExpanded = expandedId === item.id;

                            return (
                                <motion.div key={item.id} variants={itemVariants}>
                                    <div
                                        className={`glass-card overflow-hidden transition-all duration-300 ${isExpanded
                                                ? 'ring-1 ring-[hsl(var(--primary))]/30'
                                                : ''
                                            }`}
                                    >
                                        {/* Accent bar */}
                                        <div className="h-1 bg-gradient-to-r from-emerald-500/50 via-[hsl(var(--primary))] to-emerald-500/50" />

                                        {/* Header / Toggle */}
                                        <button
                                            onClick={() => toggleExpand(item.id)}
                                            className="w-full flex items-center gap-4 p-6 text-left group"
                                        >
                                            {/* Number badge */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--primary))]/15 flex items-center justify-center border border-[hsl(var(--primary))]/25">
                                                <span className="text-sm font-bold text-[hsl(var(--primary))]">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold group-hover:text-[hsl(var(--primary))] transition-colors">
                                                    {item.topic}
                                                </h3>
                                            </div>

                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex-shrink-0"
                                            >
                                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                            </motion.div>
                                        </button>

                                        {/* Expandable Content */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 space-y-4">
                                                        {/* Question */}
                                                        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <BookOpen className="w-4 h-4 text-[hsl(var(--primary))]" />
                                                                <span className="text-sm font-semibold text-[hsl(var(--primary))]">
                                                                    Question
                                                                </span>
                                                            </div>
                                                            <p className="text-foreground font-medium leading-relaxed">
                                                                {item.question}
                                                            </p>
                                                        </div>

                                                        {/* Answer */}
                                                        <div className="p-4 rounded-xl bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/15">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Scale className="w-4 h-4 text-emerald-400" />
                                                                <span className="text-sm font-semibold text-emerald-400">
                                                                    Answer
                                                                </span>
                                                            </div>
                                                            <p className="leading-relaxed text-foreground/90">
                                                                {item.answer}
                                                            </p>
                                                        </div>

                                                        {/* Rulings */}
                                                        {item.rulings && item.rulings.length > 0 && (
                                                            <div className="space-y-3">
                                                                {item.rulings.map((ruling, rIdx) => (
                                                                    <div
                                                                        key={rIdx}
                                                                        className={`p-4 rounded-xl border ${ruling.type === 'ruling'
                                                                                ? 'bg-blue-500/5 border-blue-500/20'
                                                                                : ruling.type === 'exception'
                                                                                    ? 'bg-amber-500/5 border-amber-500/20'
                                                                                    : ruling.type === 'important'
                                                                                        ? 'bg-red-500/5 border-red-500/20'
                                                                                        : 'bg-secondary/30 border-border/50'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            {ruling.type === 'ruling' && (
                                                                                <Info className="w-4 h-4 text-blue-400" />
                                                                            )}
                                                                            {ruling.type === 'exception' && (
                                                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                                            )}
                                                                            {ruling.type === 'important' && (
                                                                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                                                            )}
                                                                            {ruling.type === 'detail' && (
                                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                                            )}
                                                                            <span
                                                                                className={`text-sm font-semibold ${ruling.type === 'ruling'
                                                                                        ? 'text-blue-400'
                                                                                        : ruling.type === 'exception'
                                                                                            ? 'text-amber-400'
                                                                                            : ruling.type === 'important'
                                                                                                ? 'text-red-400'
                                                                                                : 'text-muted-foreground'
                                                                                    }`}
                                                                            >
                                                                                {ruling.label}
                                                                            </span>
                                                                        </div>
                                                                        <p className="leading-relaxed text-foreground/85 text-sm">
                                                                            {ruling.text}
                                                                        </p>
                                                                        {ruling.link && (
                                                                            <a
                                                                                href={ruling.link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center gap-1 mt-2 text-sm text-[hsl(var(--primary))] hover:underline"
                                                                            >
                                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                                {ruling.link}
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Footer note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-10 glass-card p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Scale className="w-5 h-5 text-[hsl(var(--primary))]" />
                            <h3 className="font-semibold">About This Guide</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This Fiqh Q&A guide addresses common questions about fasting
                            during the holy month of Ramadhan. The rulings are based on Shia
                            jurisprudence. For specific personal rulings, always consult your
                            Marja&apos; (religious authority).
                        </p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
