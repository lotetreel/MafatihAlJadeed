import type { Dua, Aamal, Phrase } from './ramadan_extracted';

interface RawJsonData {
    id?: string;
    title?: string;
    arabic_title?: string;
    description?: string;
    level?: string | number;
    source?: string;
    applicable_days?: 'all' | number[];
    phrases?: Phrase[];
    content_type?: string;
    preamble?: string | { english: string; arabic?: string };
    instructions?: string[];
    [key: string]: any;
}

// glob import all json files from DuaAmaal folder
const modules = import.meta.glob<RawJsonData>('../../../DuaAmaal/*.json', { eager: true });

export const duas: Dua[] = [];
export const aamal: Aamal[] = [];

// Process each file
for (const path in modules) {
    try {
        const mod = modules[path];
        // Vite's eager glob import for JSON returns a module with 'default' property containing the JSON
        const data = 'default' in mod ? (mod as any).default : mod;

        const filename = path.split('/').pop()?.replace('.json', '') || 'unknown';

        // 1. Content Type Normalization
        const rawType = String(data.content_type || 'dua').toLowerCase().trim();
        let type: 'dua' | 'aamal' = 'dua';

        if (rawType === 'amaal' || rawType === "a'amal" || rawType === 'act') {
            type = 'aamal';
        }

        // 2. Level Parsing (Handle "L1", 1, "1")
        let level: 1 | 2 | 3 = 1;
        const rawLevel = data.level;
        if (typeof rawLevel === 'string') {
            const normalized = rawLevel.toUpperCase().replace('L', '');
            const parsed = parseInt(normalized);
            if ([1, 2, 3].includes(parsed)) {
                level = parsed as 1 | 2 | 3;
            }
        } else if (typeof rawLevel === 'number' && [1, 2, 3].includes(rawLevel)) {
            level = rawLevel as 1 | 2 | 3;
        }

        // 3. Preamble & Description Logic
        let preamble = '';
        if (typeof data.preamble === 'object' && data.preamble !== null) {
            preamble = data.preamble.english || '';
        } else {
            preamble = String(data.preamble || '');
        }

        let description = data.description || '';
        if (!description) {
            // Fallback: Use preamble as description if description is missing
            description = preamble;
        }

        // 4. Construct Item
        const item: any = {
            id: data.id || filename,
            name: data.title || 'Unknown Title',
            arabicName: data.arabic_title || '',
            description: description,
            level: level,
            source: data.source || 'Mafatih al-Jinan',
            applicableDays: data.applicable_days || 'all',
            phrases: data.phrases || [],
            type: type,
            preamble: preamble
        };

        if (type === 'dua') {
            duas.push(item as Dua);
        } else {
            item.instructions = data.instructions || [];
            aamal.push(item as Aamal);
        }

    } catch (e) {
        console.error(`Failed to process file ${path}`, e);
    }
}

// Log for debugging
// Sort function based on content_order.json
import contentOrderRaw from './content_order.json';
const contentOrder = contentOrderRaw as string[];

const sortContent = (items: any[]) => {
    return items.sort((a, b) => {
        const indexA = contentOrder.indexOf(a.id);
        const indexB = contentOrder.indexOf(b.id);

        // If both are in the order list, sort by index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        // If only A is in the list, it comes first
        if (indexA !== -1) return -1;

        // If only B is in the list, it comes first
        if (indexB !== -1) return 1;

        // If neither is in the list, keep original order (or sort by name/ID if preferred)
        return 0;
    });
};

// Sort the exported arrays
sortContent(duas);
sortContent(aamal);

// Log for debugging
console.log(`Loaded ${duas.length} duas and ${aamal.length} aamal from live files.`);
