import type { ImageMetadata } from 'astro';
import shared from '../data/shared.json';

export type UnitStatus = 'available' | 'pending' | 'sold';
export type ListingType = 'sale' | 'lease';

export interface Unit {
  unit: string;
  /** A label, not a number — "2" or "Penthouse". */
  floor: string;
  planId: string;
  floorPlan: string;
  sqft: number;
  beds: number;
  baths: number;
  listingType: ListingType;
  price: number;
  status: UnitStatus;
  exposure: string;
  availableOn: string | null;
  features: string[];
  /** Terrace / balcony area. 0 = not stated. */
  exteriorSqft?: number;
  /** Path under /public, e.g. /plans/residence-201.pdf. Empty = none yet. */
  planPdf?: string;
}

// Every JSON file in src/data/units is a residence. Adding a file through the
// dashboard is all it takes for a new unit to appear on the site.
const unitModules = import.meta.glob<{ default: Unit }>('/src/data/units/*.json', {
  eager: true,
});

export const units: Unit[] = Object.values(unitModules)
  .map((mod) => mod.default)
  .sort((a, b) => a.unit.localeCompare(b.unit, 'en', { numeric: true }));

// Floor-plan images are matched by file name: planId "c" uses plan-c.jpg.
// Uploading plan-f.jpg is enough to support a new plan — no code edit needed.
const planModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/units/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const planByName = new Map<string, ImageMetadata>(
  Object.entries(planModules).map(([path, mod]) => [
    path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase(),
    mod.default,
  ]),
);

export function planImage(planId: string): ImageMetadata {
  return (
    planByName.get(`plan-${planId.toLowerCase()}`) ??
    // Fall back to any available plan image rather than breaking the build.
    planByName.values().next().value!
  );
}

export const statusMeta: Record<UnitStatus, { label: string; classes: string; dot: string }> = {
  available: {
    label: shared.unitCard.statusAvailable,
    classes: 'bg-emerald-50 text-status-available ring-emerald-600/20',
    dot: 'bg-status-available',
  },
  pending: {
    label: shared.unitCard.statusPending,
    classes: 'bg-amber-50 text-status-pending ring-amber-600/20',
    dot: 'bg-status-pending',
  },
  sold: {
    label: shared.unitCard.statusSold,
    classes: 'bg-ink-100 text-status-sold ring-ink-400/20',
    dot: 'bg-status-sold',
  },
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Sale prices read as a total, lease prices as a monthly rate. */
export function formatPrice(unit: Pick<Unit, 'price' | 'listingType'>): string {
  if (!unit.price || unit.price <= 0) return shared.unitCard.priceOnRequest;
  return unit.listingType === 'lease' ? `${usd.format(unit.price)}/mo` : usd.format(unit.price);
}

/** 0 or missing square footage renders as "TBD" rather than "0". */
export function formatSqftValue(sqft: number): string {
  return sqft > 0 ? sqft.toLocaleString('en-US') : shared.unitCard.tbd;
}

export function formatSqft(sqft: number): string {
  return sqft > 0 ? `${sqft.toLocaleString('en-US')} sq ft` : shared.unitCard.tbd;
}

export function bedLabel(beds: number): string {
  return beds === 0 ? shared.unitCard.studio : `${beds} Bed`;
}

export function bathLabel(baths: number): string {
  return `${baths} Bath`;
}

/** Collapses 3+ bedrooms into one filter bucket. */
export function bedBucket(beds: number): string {
  return beds >= 3 ? '3' : String(beds);
}

export function formatAvailableOn(iso: string | null): string {
  if (!iso) return shared.unitCard.availableNow;
  const [y, m, d] = iso.split('T')[0].split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Headline counts used on the home page and availability header. */
export function availabilitySummary(list: Unit[] = units) {
  const available = list.filter((u) => u.status === 'available');
  const forSale = available.filter((u) => u.listingType === 'sale');
  const forLease = available.filter((u) => u.listingType === 'lease');
  // Units priced 0 are "price on request" and must not drive the "from" figure.
  const salePrices = forSale.map((u) => u.price).filter((p) => p > 0);
  const leasePrices = forLease.map((u) => u.price).filter((p) => p > 0);
  return {
    total: list.length,
    available: available.length,
    forSale: forSale.length,
    forLease: forLease.length,
    saleFrom: salePrices.length ? Math.min(...salePrices) : null,
    leaseFrom: leasePrices.length ? Math.min(...leasePrices) : null,
  };
}

/** Available first, then pending, then sold; cheapest first within a group. */
const statusOrder: Record<UnitStatus, number> = { available: 0, pending: 1, sold: 2 };
export function defaultSort(list: Unit[]): Unit[] {
  return [...list].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.price - b.price,
  );
}
