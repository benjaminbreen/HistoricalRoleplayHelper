// URL ↔ app-state mapping utilities for pushState routing

export type SetupView = 'landing' | 'category' | 'gallery' | 'editor';

export interface RouteDescriptor {
  /** Which page-level view to show */
  page: 'setup' | 'enrich' | 'session' | 'lobby' | 'rejoin';
  /** SetupForm internal view (only relevant when page === 'setup') */
  setupView: SetupView;
  /** Selected mode */
  mode: 'education' | 'civic' | null;
  /** Selected category slug */
  category: string | null;
  /** True if this route requires in-memory session state to display */
  requiresState: boolean;
}

const categorySlugs = new Set([
  'history',
  'philosophy',
  'science-ethics',
  'criminal-justice',
]);

const modeCategoryMap: Record<string, Set<string>> = {
  education: new Set(['history', 'philosophy', 'science-ethics']),
  civic: new Set(['criminal-justice']),
};

/** Parse a URL pathname into a RouteDescriptor. */
export function pathToRoute(path: string): RouteDescriptor {
  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  // Default: landing
  if (segments.length === 0) {
    return { page: 'setup', setupView: 'landing', mode: null, category: null, requiresState: false };
  }

  const first = segments[0];

  // /enrich
  if (first === 'enrich') {
    return { page: 'enrich', setupView: 'landing', mode: null, category: null, requiresState: false };
  }

  // /editor
  if (first === 'editor') {
    return { page: 'setup', setupView: 'editor', mode: null, category: null, requiresState: false };
  }

  // Non-bookmarkable routes — redirect to /
  if (first === 'session' || first === 'lobby' || first === 'rejoin') {
    return { page: 'setup', setupView: 'landing', mode: null, category: null, requiresState: true };
  }

  // /education or /civic
  if (first === 'education' || first === 'civic') {
    const mode = first as 'education' | 'civic';

    // /education/{category}
    if (segments.length >= 2) {
      const catSlug = segments[1];
      if (categorySlugs.has(catSlug) && modeCategoryMap[mode]?.has(catSlug)) {
        return { page: 'setup', setupView: 'gallery', mode, category: catSlug, requiresState: false };
      }
      // Invalid category — fall back to category picker
      return { page: 'setup', setupView: 'category', mode, category: null, requiresState: false };
    }

    // /education (no sub-path)
    return { page: 'setup', setupView: 'category', mode, category: null, requiresState: false };
  }

  // Unknown path — landing
  return { page: 'setup', setupView: 'landing', mode: null, category: null, requiresState: false };
}

/** Compute the URL path from current app state. */
export function stateToPath(state: {
  page: 'setup' | 'enrich' | 'session' | 'lobby' | 'rejoin';
  setupView?: SetupView;
  mode?: 'education' | 'civic' | null;
  category?: string | null;
}): string {
  switch (state.page) {
    case 'enrich':
      return '/enrich';
    case 'session':
      return '/session';
    case 'lobby':
      return '/lobby';
    case 'rejoin':
      return '/rejoin';
    case 'setup':
      break;
  }

  const view = state.setupView ?? 'landing';
  const mode = state.mode;
  const category = state.category;

  switch (view) {
    case 'landing':
      return '/';
    case 'category':
      return mode ? `/${mode}` : '/';
    case 'gallery':
      return mode && category ? `/${mode}/${category}` : mode ? `/${mode}` : '/';
    case 'editor':
      return '/editor';
    default:
      return '/';
  }
}
