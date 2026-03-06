import { CharacterSheet } from './types';

export interface CastGroup {
  category: string;
  startIndex: number;
  count: number;
}

export interface GroupedCastResult {
  sortedCast: CharacterSheet[];
  groups: CastGroup[];
}

/**
 * Groups characters by semantic profession category using Gemini.
 * Falls back to alphabetical sort by profession on failure.
 */
export async function groupCast(cast: CharacterSheet[]): Promise<GroupedCastResult> {
  // Extract unique non-empty professions
  const professions = [...new Set(
    cast.map((c) => c.profession?.trim()).filter((p): p is string => !!p)
  )];

  // Not enough diversity to bother grouping
  if (professions.length <= 1 || cast.length <= 2) {
    return { sortedCast: cast, groups: [] };
  }

  let categoryMap: Map<string, string>;

  try {
    const res = await fetch('/api/group-cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professions }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const data = (await res.json()) as { categories: Record<string, string> };
    categoryMap = new Map(Object.entries(data.categories || {}));
  } catch {
    // Fallback: use profession itself as category
    categoryMap = new Map(professions.map((p) => [p, p]));
  }

  const UNGROUPED = 'Other';

  // Assign category to each character
  const tagged = cast.map((c) => ({
    sheet: c,
    category: (c.profession && categoryMap.get(c.profession)) || UNGROUPED,
  }));

  // Sort: category alphabetically, then profession within category
  tagged.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return (a.sheet.profession || '').localeCompare(b.sheet.profession || '');
  });

  // Build group metadata
  const groups: CastGroup[] = [];
  let current = '';
  for (let i = 0; i < tagged.length; i++) {
    if (tagged[i].category !== current) {
      current = tagged[i].category;
      groups.push({ category: current, startIndex: i, count: 1 });
    } else {
      groups[groups.length - 1].count++;
    }
  }

  return {
    sortedCast: tagged.map((t) => t.sheet),
    groups,
  };
}
