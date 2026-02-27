/**
 * API Service Layer – Connects React frontend to Express backend
 * ==============================================================
 * Calls the Express API endpoints. Falls back gracefully to local mock
 * data when the backend is unreachable (e.g. during frontend-only preview).
 *
 * Set VITE_API_URL in .env to point to your Express server:
 *   VITE_API_URL=http://localhost:5000/api
 */

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api';

// ── Generic fetch helper ───────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallback?: T
): Promise<{ data: T; fromApi: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data ?? json, fromApi: true };
  } catch {
    // Backend unreachable — return fallback mock data
    if (fallback !== undefined) {
      return { data: fallback, fromApi: false };
    }
    throw new Error(`API request failed: ${endpoint}`);
  }
}

// ── Destination API ────────────────────────────────────────
export const destinationApi = {
  getAll: (category?: string) =>
    apiFetch<any[]>(`/destinations${category && category !== 'all' ? `?category=${category}` : ''}`, {}, []),

  getById: (id: string) =>
    apiFetch<any>(`/destinations/${id}`),

  create: (data: any) =>
    apiFetch<any>('/destinations', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<any>(`/destinations/${id}`, { method: 'DELETE' }),
};

// ── Package API ────────────────────────────────────────────
export const packageApi = {
  getAll: (params?: { destination?: string; minPrice?: number; maxPrice?: number; sortBy?: string }) => {
    const query = new URLSearchParams();
    if (params?.destination) query.set('destination', params.destination);
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    const qs = query.toString();
    return apiFetch<any[]>(`/packages${qs ? `?${qs}` : ''}`, {}, []);
  },

  getById: (id: string) =>
    apiFetch<any>(`/packages/${id}`),

  search: (queryStr: string) =>
    apiFetch<any[]>('/packages/search', { method: 'POST', body: JSON.stringify({ query: queryStr }) }, []),

  create: (data: any) =>
    apiFetch<any>('/packages', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<any>(`/packages/${id}`, { method: 'DELETE' }),
};

// ── Trip API ───────────────────────────────────────────────
export const tripApi = {
  getAll: (status?: string) =>
    apiFetch<any[]>(`/trips${status ? `?status=${status}` : ''}`, {}, []),

  getById: (id: string) =>
    apiFetch<any>(`/trips/${id}`),

  create: (data: any) =>
    apiFetch<any>('/trips', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    apiFetch<any>(`/trips/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id: string) =>
    apiFetch<any>(`/trips/${id}`, { method: 'DELETE' }),

  getStats: () =>
    apiFetch<any>('/trips/stats', {}, { total: 24, confirmed: 12, pending: 8, inProgress: 4, totalRevenue: 1240000 }),
};

// ── Quote API ──────────────────────────────────────────────
export const quoteApi = {
  getAll: (status?: string) =>
    apiFetch<any[]>(`/quotes${status ? `?status=${status}` : ''}`, {}, []),

  getById: (id: string) =>
    apiFetch<any>(`/quotes/${id}`),

  create: (data: any) =>
    apiFetch<any>('/quotes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiFetch<any>(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    apiFetch<any>(`/quotes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id: string) =>
    apiFetch<any>(`/quotes/${id}`, { method: 'DELETE' }),
};

// ── Search API ─────────────────────────────────────────────
export const searchApi = {
  getRecent: (agentId?: string) =>
    apiFetch<any[]>(`/searches/recent${agentId ? `?agentId=${agentId}` : ''}`, {}, []),

  create: (data: any) =>
    apiFetch<any>('/searches', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<any>(`/searches/${id}`, { method: 'DELETE' }),

  clear: (agentId?: string) =>
    apiFetch<any>('/searches/clear', { method: 'DELETE', body: JSON.stringify({ agentId }) }),
};

// ── Health Check ───────────────────────────────────────────
export const healthCheck = () =>
  apiFetch<{ status: string; timestamp: string }>('/health', {}, { status: 'offline', timestamp: new Date().toISOString() });
