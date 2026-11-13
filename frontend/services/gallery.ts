import type { GalleryItem } from '@/types';

// Temporary records until the gallery API is connected.
const ITEMS: GalleryItem[] = [
  { id: 'us-20', category: 'ultrasound', label: 'Week 20', title: 'Week 20 Anomaly Scan' },
  { id: 'us-16', category: 'ultrasound', label: 'Week 16', title: 'Week 16 Growth Scan' },
  { id: 'us-12', category: 'ultrasound', label: 'Week 12', title: 'Week 12 Dating Scan' },
  { id: 'us-8', category: 'ultrasound', label: 'Week 8', title: 'Week 8 Early Scan' },
  { id: 'belly-20', category: 'belly', label: 'Week 20', title: 'Week 20 Bump' },
  { id: 'belly-16', category: 'belly', label: 'Week 16', title: 'Week 16 Bump' },
  { id: 'belly-12', category: 'belly', label: 'Week 12', title: 'Week 12 Bump' },
  { id: 'belly-8', category: 'belly', label: 'Week 8', title: 'Week 8 Bump' },
  { id: 'rx-3', category: 'prescription', label: 'Aug 3 – Folic Acid', title: 'Folic Acid' },
  { id: 'rx-2', category: 'prescription', label: 'Jul 15 – Iron supplement', title: 'Iron supplement' },
  { id: 'rx-1', category: 'prescription', label: 'Jun 28 – Vitamin D', title: 'Vitamin D' },
];

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return ITEMS;
}
