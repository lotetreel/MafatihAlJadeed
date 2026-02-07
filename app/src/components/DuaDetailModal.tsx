import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DuaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: string;
        name: string;
        arabicName: string;
        description: string;
        level: 1 | 2 | 3;
        source: string;
        type: 'dua' | 'aamal';
        timing?: string;
        applicableDays: 'all' | number[];
        arabicText?: string;
        englishTranslation?: string;
        transliteration?: string;
        instructions?: string[];
    } | null;
}

export function DuaDetailModal({ isOpen, onClose, item }: DuaDetailModalProps) {
    const [copied, setCopied] = useState(false);
    const [showTransliteration, setShowTransliteration] = useState(false);

    if (!item) return null;

    const handleCopyArabic = async () => {
        if (item.arabicText) {
            await navigator.clipboard.writeText(item.arabicText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const hasArabicText = item.arabicText && item.arabicText.trim().length > 0;
    const hasTranslation = item.englishTranslation && item.englishTranslation.trim().length > 0;
    const hasTransliteration = item.transliteration && item.transliteration.trim().length > 0;
    const hasInstructions = item.instructions && item.instructions.length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="glass-card w-full max-w-4xl max-h-full overflow-hidden flex flex-col pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-border/30">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${item.type === 'dua'
                                            ? 'bg-indigo-500/20'
                                            : 'bg-amber-500/20'
                                        }`}>
                                        {item.type === 'dua' ? (
                                            <BookOpen className="w-6 h-6 text-indigo-400" />
                                        ) : (
                                            <Clock className="w-6 h-6 text-amber-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl md:text-2xl font-bold mb-1 truncate">{item.name}</h2>
                                        {item.arabicName && (
                                            <p className="arabic text-lg text-muted-foreground">{item.arabicName}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.type === 'dua'
                                                    ? 'bg-indigo-500/20 text-indigo-400'
                                                    : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {item.type === 'dua' ? 'Dua' : "A'mal"}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.level === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                                                    item.level === 2 ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                Level {item.level}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.source}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Description / Preamble */}
                                {item.description && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            About
                                        </h3>
                                        <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                                            {item.description}
                                        </p>
                                    </div>
                                )}

                                {/* Instructions (for aamal) */}
                                {hasInstructions && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            Instructions
                                        </h3>
                                        <ol className="space-y-2 list-decimal list-inside">
                                            {item.instructions!.map((instruction, idx) => (
                                                <li key={idx} className="text-foreground/90 leading-relaxed">
                                                    {instruction}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* Arabic Text */}
                                {hasArabicText && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                Arabic Text
                                            </h3>
                                            <button
                                                onClick={handleCopyArabic}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="glass-card p-6 bg-secondary/30">
                                            <p
                                                className="arabic text-xl md:text-2xl leading-loose text-right"
                                                dir="rtl"
                                                lang="ar"
                                            >
                                                {item.arabicText}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Transliteration (collapsible) */}
                                {hasTransliteration && (
                                    <div>
                                        <button
                                            onClick={() => setShowTransliteration(!showTransliteration)}
                                            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-3"
                                        >
                                            <span>Transliteration</span>
                                            {showTransliteration ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                        <AnimatePresence>
                                            {showTransliteration && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="glass-card p-6 bg-secondary/20">
                                                        <p className="text-foreground/80 leading-relaxed italic">
                                                            {item.transliteration}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* English Translation */}
                                {hasTranslation && (
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            English Translation
                                        </h3>
                                        <div className="glass-card p-6 bg-secondary/20">
                                            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                                                {item.englishTranslation}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* No content message */}
                                {!hasArabicText && !hasTranslation && !hasInstructions && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Full content for this {item.type} is not yet available.</p>
                                        <p className="text-sm mt-2">Check back soon for updates.</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border/30 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
