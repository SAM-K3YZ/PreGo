import * as Icon from 'phosphor-react-native';
import type {
  AddMethodOption,
  GalleryCategory,
  GalleryCategoryOption,
  GalleryTab,
  Theme,
} from '@/types';

export const GALLERY_TABS: GalleryTab[] = [
  { category: 'ultrasound', label: 'Ultrasounds' },
  { category: 'belly', label: 'Belly Photos' },
  { category: 'prescription', label: 'Prescriptions' },
];

export const GALLERY_ICON: Record<GalleryCategory, Icon.Icon> = {
  ultrasound: Icon.HeartbeatIcon,
  belly: Icon.BabyIcon,
  prescription: Icon.PillIcon,
};

export const getGalleryColors = (theme: Theme, category: GalleryCategory) =>
  theme.gallery[category];

// Add to Gallery: how to add, and where it goes.
export const ADD_METHODS: AddMethodOption[] = [
  {
    method: 'camera',
    title: 'Take Photo',
    subtitle: 'Open your camera now',
    icon: Icon.CameraIcon,
  },
  {
    method: 'library',
    title: 'Choose from Library',
    subtitle: 'Pick from your camera roll',
    icon: Icon.ImagesIcon,
  },
  {
    method: 'scan',
    title: 'Scan Prescription',
    subtitle: 'Photograph a paper prescription',
    icon: Icon.ScanIcon,
    category: 'prescription',
  },
  {
    method: 'pdf',
    title: 'Upload PDF',
    subtitle: 'A prescription saved as a file',
    icon: Icon.FilePdfIcon,
    category: 'prescription',
  },
];

export const CATEGORY_OPTIONS: GalleryCategoryOption[] = [
  { category: 'ultrasound', title: 'Ultrasound', subtitle: 'Scan images from appointments' },
  { category: 'belly', title: 'Belly Photo', subtitle: 'Bump progress photos' },
  { category: 'prescription', title: 'Prescription', subtitle: 'Medication prescriptions' },
];

export const CATEGORY_TITLE: Record<GalleryCategory, string> = {
  ultrasound: 'Ultrasound',
  belly: 'Belly Photos',
  prescription: 'Prescriptions',
};
