import { useState, useEffect, useMemo } from 'react';
import { Reorder } from 'framer-motion';
import { duas, aamal } from '@/data/content';
import contentOrderRaw from '@/data/content_order.json';
import { ArrowLeft, GripVertical, Save, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminOrder() {
    const contentOrder = contentOrderRaw as string[];

    const { initialGroups, initialUntagged, sortedKeys, newCount } = useMemo(() => {
        const allItems = [
            ...aamal.map(a => ({ ...a, type: 'aamal' })),
            ...duas.map(d => ({ ...d, type: 'dua' }))
        ];

        const groups: Record<string, any[]> = {};
        const untagged: any[] = [];
        let newItemsC = 0;

        allItems.forEach(item => {
            if (!contentOrder.includes(item.id)) {
                newItemsC++;
            }

            if (!item.timing || !Array.isArray(item.timing) || item.timing.length === 0) {
                untagged.push(item);
            } else {
                item.timing.forEach((t: string) => {
                    if (!groups[t]) groups[t] = [];
                    if (!groups[t].find(i => i.id === item.id)) {
                        groups[t].push(item);
                    }
                });
            }
        });

        const sortFn = (a: any, b: any) => {
            const indexA = contentOrder.indexOf(a.id);
            const indexB = contentOrder.indexOf(b.id);

            if (indexA === -1 && indexB !== -1) return -1;
            if (indexB === -1 && indexA !== -1) return 1;
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;

            return a.type === 'aamal' ? -1 : 1;
        };

        Object.keys(groups).forEach(key => {
            groups[key].sort(sortFn);
        });
        untagged.sort(sortFn);

        const logicalOrderKeys = ["Suhoor", "Days of Shahr Ramadhan", "Iftar", "After Every Obligatory Prayer", "Nights of Shahr Ramadan"];
        const keys = Object.keys(groups).sort((a, b) => {
            const indexA = logicalOrderKeys.indexOf(a);
            const indexB = logicalOrderKeys.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        return { initialGroups: groups, initialUntagged: untagged, sortedKeys: keys, newCount: newItemsC };
    }, []);

    const [groupsState, setGroupsState] = useState<Record<string, any[]>>({});
    const [untaggedState, setUntaggedState] = useState<any[]>([]);

    useEffect(() => {
        setGroupsState(initialGroups);
        setUntaggedState(initialUntagged);
    }, [initialGroups, initialUntagged]);

    const handleReorderGroup = (key: string, newOrder: any[]) => {
        setGroupsState(prev => ({
            ...prev,
            [key]: newOrder
        }));
    };

    const handleReorderUntagged = (newOrder: any[]) => {
        setUntaggedState(newOrder);
    };

    const handleDownload = () => {
        const fullList: string[] = [];
        const seen = new Set<string>();

        const addItems = (items: any[]) => {
            items.forEach(item => {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    fullList.push(item.id);
                }
            });
        };

        sortedKeys.forEach(key => {
            if (groupsState[key]) {
                addItems(groupsState[key]);
            }
        });
        addItems(untaggedState);

        const jsonString = JSON.stringify(fullList, null, 2);
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

    const renderReorderItem = (item: any) => {
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
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.id}</p>
                    </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                    L{item.level}
                </div>
            </Reorder.Item>
        );
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
                    Drag and drop items within their respective groups to reorder them. The order within groups will be saved.
                </p>
            </div>

            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-full">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">How to Save</h3>
                            <p className="text-sm opacity-90">
                                1. Reorder items below.<br />
                                2. Click "Download Configuration".<br />
                                3. Save the file to <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">src/data/content_order.json</code>.<br />
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

                {newCount > 0 && (
                    <div className="mb-8 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">{newCount} new item{newCount > 1 ? 's' : ''} found</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            New items are placed at the top of their respective groups. Adjust their position and download the config.
                        </p>
                    </div>
                )}

                <div className="space-y-12 mb-8">
                    {sortedKeys.map(key => {
                        const items = groupsState[key] || [];
                        if (items.length === 0) return null;

                        return (
                            <div key={key} className="space-y-3">
                                <div className="flex items-center gap-3 border-b border-border/40 pb-2">
                                    <h3 className="text-xl font-semibold text-foreground">{key}</h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground ml-auto">
                                        {items.length}
                                    </span>
                                </div>
                                <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                                    <Reorder.Group axis="y" values={items} onReorder={(newOrder) => handleReorderGroup(key, newOrder)} className="divide-y divide-border/50">
                                        {items.map(renderReorderItem)}
                                    </Reorder.Group>
                                </div>
                            </div>
                        );
                    })}

                    {untaggedState.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 border-b border-border/40 pb-2">
                                <h3 className="text-xl font-semibold opacity-80">Other Practices</h3>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground ml-auto">
                                    {untaggedState.length}
                                </span>
                            </div>
                            <div className="bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                                <Reorder.Group axis="y" values={untaggedState} onReorder={handleReorderUntagged} className="divide-y divide-border/50">
                                    {untaggedState.map(renderReorderItem)}
                                </Reorder.Group>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
