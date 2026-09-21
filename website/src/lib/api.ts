const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

async function fetchJSON(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getProperties(params?: {
  limit?: number;
  page?: number;
  type?: string;
  offer?: string;
  area?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.type) qs.set('type', params.type);
  if (params?.offer) qs.set('offer', params.offer);
  if (params?.area) qs.set('area', params.area);
  if (params?.min_price) qs.set('min_price', params.min_price);
  if (params?.max_price) qs.set('max_price', params.max_price);
  if (params?.sort) qs.set('sort', params.sort);

  const url = `/api/properties${qs.toString() ? `?${qs}` : ''}`;
  return fetchJSON(url);
}

export async function getProperty(id: string | number) {
  return fetchJSON(`/api/properties/${id}`);
}

export async function getPropertyStats() {
  const data = await fetchJSON('/api/properties/stats');
  return data.data || data;
}

export async function getAreas() {
  return fetchJSON('/api/areas');
}

export async function getArea(id: string | number) {
  return fetchJSON(`/api/areas/${id}`);
}

export async function getClients() {
  return fetchJSON('/api/clients');
}

export async function estimatePrice(payload: Record<string, any>) {
  return fetchJSON('/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function searchProperties(q: string) {
  return fetchJSON(`/api/search?q=${encodeURIComponent(q)}`);
}

export { API_URL };
