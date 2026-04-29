/**
 * Course Display Configuration
 *
 * Single source of truth for course status labels, badge variants,
 * CTA behavior, and Schema.org offer availability.
 *
 * Used by: CourseLayout.astro, courses/index.astro, SEO.astro
 */

import { siteConfig } from './siteConfig';

// ── Types ──

export type CourseStatus = 'draft' | 'pre-sale' | 'active' | 'archived';
export type CourseLevel = '初級' | '中級' | '高級';

export interface CourseCtaConfig {
  /** Whether to show CTA button */
  show: boolean;
  /** CTA link href */
  href: string;
  /** CTA button text */
  text: string;
  /** Whether link opens in new tab */
  isExternal: boolean;
  /** Hint text below CTA (e.g. pre-sale message) */
  hint?: string;
}

export interface CourseOfferConfig {
  /** Schema.org availability URL */
  availability: string;
  /** Whether to include offer URL in JSON-LD */
  includeUrl: boolean;
}

// ── Status Display ──

const STATUS_LABELS: Record<CourseStatus, string> = {
  'draft': '草稿',
  'pre-sale': '預售中',
  'active': '開放報名',
  'archived': '已結束',
};

const STATUS_BADGE_CLASS: Record<CourseStatus, string> = {
  'draft': 'badge-accent',
  'pre-sale': 'badge-warning',
  'active': 'badge-success',
  'archived': 'badge-accent',
};

export function getStatusLabel(status: CourseStatus): string {
  return STATUS_LABELS[status];
}

export function getStatusBadgeClass(status: CourseStatus): string {
  return STATUS_BADGE_CLASS[status];
}

// ── Level Display ──

const LEVEL_BADGE_CLASS: Record<CourseLevel, string> = {
  '初級': 'badge-success',
  '中級': 'badge-warning',
  '高級': 'badge-error',
};

export function getLevelBadgeClass(level: CourseLevel): string {
  return LEVEL_BADGE_CLASS[level];
}

// ── CTA Logic ──

/**
 * Derive CTA configuration from course status and checkout URL.
 *
 * Rules:
 * - active + checkoutUrl → buy CTA to shop
 * - active + no checkoutUrl → contact CTA to Threads
 * - pre-sale (regardless of checkoutUrl) → pre-sale CTA to Threads
 * - draft/archived → no CTA
 */
export function getCourseCtaConfig(
  status: CourseStatus,
  checkoutUrl?: string,
): CourseCtaConfig {
  if (status === 'draft' || status === 'archived') {
    return { show: false, href: '', text: '', isExternal: false };
  }

  if (status === 'active' && checkoutUrl) {
    return {
      show: true,
      href: checkoutUrl,
      text: '立即購買',
      isExternal: true,
    };
  }

  if (status === 'active') {
    return {
      show: true,
      href: siteConfig.threadsUrl,
      text: '聯繫購買',
      isExternal: true,
    };
  }

  // pre-sale
  return {
    show: true,
    href: siteConfig.threadsUrl,
    text: '搶先預購',
    isExternal: true,
    hint: '課程準備中，私訊即可搶先預購',
  };
}

// ── Schema.org Offer ──

/**
 * Derive offer availability for JSON-LD.
 *
 * Rules:
 * - active + checkoutUrl → InStock, include URL
 * - active + no checkoutUrl → PreOrder, no URL
 * - pre-sale → PreOrder, no URL (even if checkoutUrl exists)
 * - draft/archived → no offer
 */
export function getCourseOfferConfig(
  status: CourseStatus,
  checkoutUrl?: string,
): CourseOfferConfig | null {
  if (status === 'draft' || status === 'archived') {
    return null;
  }

  if (status === 'active' && checkoutUrl) {
    return {
      availability: 'https://schema.org/InStock',
      includeUrl: true,
    };
  }

  // active without checkout, or pre-sale
  return {
    availability: 'https://schema.org/PreOrder',
    includeUrl: false,
  };
}

// ── Price Formatting ──

export function formatPrice(price: number): string {
  if (price === 0) return '免費';
  return `NT$ ${price.toLocaleString()}`;
}
