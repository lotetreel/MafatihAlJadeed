import { useState, useEffect, useMemo } from 'react';
import { Reorder } from 'framer-motion';
import { duas, aamal } from '@/data/content';
import contentOrderRaw from '@/data/content_order.json';
import { ArrowLeft, GripVertical, Save, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminOrder() {
    const [items, setItems] = useState<any[]>([]);
    const contentOrder = contentOrderRaw as string[];

    // Identify new items (not in content_order.json)
    const { newItems, existingItems } = useMemo(() => {
        const allItems = [
            ...aamal.map(a => ({ ...a, type: 'aamal' })),
            ...duas.map(d => ({ ...d, type: 'dua' }))
        ];

        const newOnes: any[] = [];
        const existing: any[] = [];

        allItems.forEach(item => {
            if (contentOrder.includes(item.id)) {
                existing.push(item);
            } else {
                newOnes.push(item);
            }
        });

        // Sort existing items by their order in content_order.json
        existing.sort((a, b) => {
            return contentOrder.indexOf(a.id) - contentOrder.indexOf(b.id);
        });

        return { newItems: newOnes, existingItems: existing };
    }, []);

    useEffect(() => {
        // Initialize with new items at top, then existing items
        setItems([...newItems, ...existingItems]);
    }, [newItems, existingItems]);

    const handleReorder = (newOrder: any[]) => {
        setItems(newOrder);
    };

    const handleDownload = () => {
        const orderIds = items.map(item => item.id);
        const jsonString = JSON.stringify(orderIds, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'content_order.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold mb-2">Manage Content Order</h1>
                <p className="text-muted-foreground">
                    Drag and drop items to reorder them. This order will be used on the "Aamal & Dua" page.
                </p>
            </div>

            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-full">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">How to Save</h3>
                            <p className="text-sm opacity-90">
                                1. Reorder items below.<br />
                                2. Click "Download Configuration".<br />
                                3. Save the file to <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">src/data/content_order.json</code> in your project folder.<br />
                                4. The app will update automatically.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:brightness-110 transition-all font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Download Configuration
                    </button>
                </div>

                {newItems.length > 0 && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">{newItems.length} new item{newItems.length > 1 ? 's' : ''} found</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            These items are not yet in your saved order. Drag them to your preferred position, then download the config.
                        </p>
                    </div>
                )}

                <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                    <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="divide-y divide-border/50">
                        {items.map((item) => {
                            const isNew = !contentOrder.includes(item.id);
                            return (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    className={`bg-card flex items-center p-3 gap-3 cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition-colors ${isNew ? 'ring-2 ring-emerald-500/30 ring-inset' : ''}`}
                                >
                                    <GripVertical className="w-5 h-5 text-muted-foreground/50" />
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${item.type === 'dua' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {item.type === 'dua' ? 'DUA' : 'AML'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium truncate">{item.name}</h4>
                                            {isNew && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 uppercase">New</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{item.id}</p>
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                                        L{item.level}
                                    </div>
                                </Reorder.Item>
                            );
                        })}
                    </Reorder.Group>
                </div>
            </div>
        </div>
    );
}
