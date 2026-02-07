import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { duas, aamal } from '@/data/content';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Copy,
    Check,
    Settings2,
    List,
    Type,
    Languages,
    Minus,
    Plus
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';

export function DuaDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // View State
    const [viewType, setViewType] = useState<'phrase' | 'continuous'>('phrase');
    const [showArabic, setShowArabic] = useState(true);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [showEnglish, setShowEnglish] = useState(true);

    // Typography Settings
    const [arabicLineHeight, setArabicLineHeight] = useState(2.2); // Higher default to prevent harakat overlap
    const [arabicFontSize, setArabicFontSize] = useState(2); // rem units (2rem = 32px)
    const [englishFontSize, setEnglishFontSize] = useState(1.125); // rem units (1.125rem = 18px)

    // Find the item from duas or aamal
    const item = useMemo(() => {
        const foundDua = duas.find(d => d.id === id);
        if (foundDua) return { ...foundDua, type: 'dua' as const };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const foundAamal = aamal.find(a => a.id === id) as any;
        if (foundAamal) return { ...foundAamal, type: 'aamal' as const };

        return null;
    }, [id]);

    // Set initial view type - default to phrase by phrase if available
    useEffect(() => {
        if (item) {
            if (item.phrases && item.phrases.length > 0) {
                setViewType('phrase');
            } else {
                setViewType('continuous');
            }
        }
    }, [item]);

    const handleCopyArabic = async () => {
        if (item && 'arabicText' in item && item.arabicText) {
            await navigator.clipboard.writeText(item.arabicText || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!item) {
        return (
            <PageTransition>
                <div className="page-container relative pt-24 pb-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
                        <button
                            onClick={() => navigate('/aamal-dua')}
                            className="text-primary hover:underline"
                        >
                            Return to Aamal & Dua
                        </button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    const hasPhrases = item.phrases && item.phrases.length > 0;
    const arabicText = item.arabicText || item.phrases?.map(p => p.arabic).join(' ') || '';
    const englishTranslation = item.englishTranslation || item.phrases?.map(p => p.english).join(' ') || '';
    const transliteration = item.transliteration || item.phrases?.map(p => p.transliteration).join(' ') || '';

    return (
        <PageTransition>
            <div className="page-container relative pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/aamal-dua')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </motion.button>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            {/* Phrase by Phrase Toggle Button */}
                            {hasPhrases && (
                                <button
                                    onClick={() => setViewType(viewType === 'phrase' ? 'continuous' : 'phrase')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewType === 'phrase'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    <span>Phrase by Phrase</span>
                                </button>
                            )}

                            {/* View Settings Popover */}
                            <Popover.Root>
                                <Popover.Trigger asChild>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors">
                                        <Settings2 className="w-4 h-4" />
                                        <span>View Settings</span>
                                    </button>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className="z-50 w-64 p-4 rounded-xl glass-card animate-scale-in" sideOffset={5}>
                                        <div className="space-y-4">

                                            {/* Language Toggles */}
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</h4>
                                                <div className="space-y-1">
                                                    <label className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Languages className="w-4 h-4 text-emerald-400" />
                                                            <span>Arabic</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={showArabic}
                                                            onChange={(e) => setShowArabic(e.target.checked)}
                                                            className="rounded border-input text-primary focus:ring-primary"
                                                        />
                                                    </label>
                                                    <label className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Type className="w-4 h-4 text-amber-400" />
                                                            <span>Transliteration</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={showTransliteration}
                                                            onChange={(e) => setShowTransliteration(e.target.checked)}
                                                            className="rounded border-input text-primary focus:ring-primary"
                                                        />
                                                    </label>
                                                    <label className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Type className="w-4 h-4 text-indigo-400" />
                                                            <span>Translation</span>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={showEnglish}
                                                            onChange={(e) => setShowEnglish(e.target.checked)}
                                                            className="rounded border-input text-primary focus:ring-primary"
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Typography Settings */}
                                            <div className="space-y-3 pt-2 border-t border-border/50">
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h4>

                                                {/* Arabic Line Height */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Arabic Line Height</span>
                                                        <span className="text-xs text-muted-foreground">{arabicLineHeight.toFixed(1)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setArabicLineHeight(Math.max(1.5, arabicLineHeight - 0.2))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="1.5"
                                                            max="3.5"
                                                            step="0.1"
                                                            value={arabicLineHeight}
                                                            onChange={(e) => setArabicLineHeight(parseFloat(e.target.value))}
                                                            className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <button
                                                            onClick={() => setArabicLineHeight(Math.min(3.5, arabicLineHeight + 0.2))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Arabic Font Size */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Arabic Size</span>
                                                        <span className="text-xs text-muted-foreground">{Math.round(arabicFontSize * 16)}px</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setArabicFontSize(Math.max(1.25, arabicFontSize - 0.25))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="1.25"
                                                            max="3.5"
                                                            step="0.25"
                                                            value={arabicFontSize}
                                                            onChange={(e) => setArabicFontSize(parseFloat(e.target.value))}
                                                            className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <button
                                                            onClick={() => setArabicFontSize(Math.min(3.5, arabicFontSize + 0.25))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* English Font Size */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">English Size</span>
                                                        <span className="text-xs text-muted-foreground">{Math.round(englishFontSize * 16)}px</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEnglishFontSize(Math.max(0.875, englishFontSize - 0.125))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="0.875"
                                                            max="1.75"
                                                            step="0.125"
                                                            value={englishFontSize}
                                                            onChange={(e) => setEnglishFontSize(parseFloat(e.target.value))}
                                                            className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                                        />
                                                        <button
                                                            onClick={() => setEnglishFontSize(Math.min(1.75, englishFontSize + 0.125))}
                                                            className="p-1 rounded hover:bg-muted/50"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Popover.Arrow className="fill-border" />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </div>
                    </div>

                    {/* Title & Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 text-center"
                    >
                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${item.type === 'dua' ? 'bg-indigo-500/20' : 'bg-amber-500/20'
                            }`}>
                            {item.type === 'dua' ? <BookOpen className="w-8 h-8 text-indigo-400" /> : <Clock className="w-8 h-8 text-amber-400" />}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h1>
                        {item.arabicName && <p className="arabic text-2xl text-muted-foreground mb-4">{item.arabicName}</p>}

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.type === 'dua'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                {item.type === 'dua' ? 'Dua' : "A'mal"}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                                {item.source}
                            </span>
                        </div>
                    </motion.div>

                    {/* Description / Preamble */}
                    {(item.description || item.preamble) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 mb-8 text-center"
                        >
                            <p className="text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                                {item.preamble || item.description}
                            </p>
                        </motion.div>
                    )}

                    {/* Content Display */}
                    <AnimatePresence mode="wait">
                        {viewType === 'phrase' && hasPhrases ? (
                            <motion.div
                                key="phrase-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {item.phrases?.map((phrase: { arabic: string; english: string; transliteration?: string }, idx: number) => (
                                    <div key={idx} className="glass-card p-6 hover:bg-card/50 transition-colors">
                                        {/* Arabic */}
                                        {showArabic && (
                                            <div className="mb-4 text-center">
                                                <p
                                                    className="arabic text-foreground/90"
                                                    dir="rtl"
                                                    style={{ fontSize: `${arabicFontSize}rem`, lineHeight: arabicLineHeight }}
                                                >
                                                    {phrase.arabic}
                                                </p>
                                            </div>
                                        )}

                                        {/* Translation */}
                                        {showEnglish && (
                                            <div className="mb-2 text-center">
                                                <p
                                                    className="text-muted-foreground"
                                                    style={{ fontSize: `${englishFontSize}rem` }}
                                                >
                                                    {phrase.english}
                                                </p>
                                            </div>
                                        )}

                                        {/* Transliteration */}
                                        {showTransliteration && phrase.transliteration && (
                                            <div className="text-center">
                                                <p className="text-amber-400/90 font-medium italic">
                                                    {phrase.transliteration}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="continuous-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Continuous Arabic */}
                                {showArabic && arabicText && (
                                    <div className="glass-card p-8 bg-secondary/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arabic Text</h3>
                                            <button onClick={handleCopyArabic} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <p
                                            className="arabic text-justify text-foreground/90"
                                            dir="rtl"
                                            style={{ fontSize: `${arabicFontSize}rem`, lineHeight: arabicLineHeight }}
                                        >
                                            {arabicText}
                                        </p>
                                    </div>
                                )}

                                {/* Continuous English */}
                                {showEnglish && englishTranslation && (
                                    <div className="glass-card p-8">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Translation</h3>
                                        <p
                                            className="leading-relaxed text-foreground/90"
                                            style={{ fontSize: `${englishFontSize}rem` }}
                                        >
                                            {englishTranslation}
                                        </p>
                                    </div>
                                )}

                                {/* Continuous Transliteration */}
                                {showTransliteration && transliteration && (
                                    <div className="glass-card p-8">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Transliteration</h3>
                                        <p className="text-lg leading-relaxed text-amber-400/90 italic">
                                            {transliteration}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Instructions (if any) */}
                    {'instructions' in item && item.instructions && item.instructions.length > 0 && (
                        <div className="mt-12 glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {item.instructions.map((inst: string, i: number) => (
                                    <li key={i}>{inst}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
