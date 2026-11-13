import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Button, OptionCard, Screen } from '@/components/ui';
import {
  ADD_METHODS,
  CATEGORY_OPTIONS,
  CATEGORY_TITLE,
  GALLERY_ICON,
} from '@/components/gallery/galleryVisuals';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useAddGalleryItem } from '@/hooks/useGallery';
import { useTheme } from '@/hooks/useTheme';
import { choosePdf, choosePhoto, takePhoto } from '@/services/media';
import { useGalleryUiStore } from '@/store/useGalleryUiStore';
import { scale } from '@/utils/styling';
import type { AddMethod, GalleryCategory, PickedFile } from '@/types';

const PICKERS: Record<AddMethod, () => Promise<PickedFile | null>> = {
  camera: takePhoto,
  library: choosePhoto,
  scan: takePhoto,
  pdf: choosePdf,
};

// Method tiles reuse the gallery colours: pink camera, green library, lavender scan, PDF.
const METHOD_PALETTE: Record<AddMethod, GalleryCategory> = {
  camera: 'belly',
  library: 'prescription',
  scan: 'ultrasound',
  pdf: 'prescription',
};

export default function AddToGallery() {
  const theme = useTheme();
  const addItem = useAddGalleryItem();
  const setGalleryCategory = useGalleryUiStore((s) => s.setCategory);
  const [method, setMethod] = useState<AddMethod | null>(null);
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [busy, setBusy] = useState(false);

  // Scan and PDF are prescription-only, so they lock the category.
  const lockedCategory = ADD_METHODS.find((option) => option.method === method)?.category;
  const canSubmit = !!method && !!category && !busy;

  const selectMethod = (next: AddMethod) => {
    setMethod(next);
    const locked = ADD_METHODS.find((option) => option.method === next)?.category;
    if (locked) setCategory(locked);
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/gallery'));

  const submit = async () => {
    if (!method || !category || busy) return;
    setBusy(true);
    try {
      const file = await PICKERS[method]();
      if (!file) return; // cancelled, or permission declined
      const added = `Added ${format(new Date(), 'MMM d')}`;
      addItem({
        id: `local-${Date.now()}`,
        category,
        label: category === 'prescription' ? (file.name ?? 'Prescription') : added,
        title: file.name ?? added,
        uri: file.uri,
        mimeType: file.mimeType,
      });
      setGalleryCategory(category);
      goBack();
    } catch {
      Alert.alert("Couldn't add file", 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.back,
            { backgroundColor: theme.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Icon.ArrowLeftIcon size={scale(20)} color={theme.text.primary} weight="bold" />
        </Pressable>
        <Typo size={24} fontWeight="700" color={theme.text.primary}>
          Add to Gallery
        </Typo>
      </View>

      <View style={styles.section} accessibilityRole="radiogroup">
        <Typo size={16} fontWeight="700" color={theme.text.primary}>
          How would you like to add?
        </Typo>
        {ADD_METHODS.map((option) => {
          const palette = theme.gallery[METHOD_PALETTE[option.method]];
          return (
            <OptionCard
              key={option.method}
              icon={option.icon}
              iconColor={palette.icon}
              tileColor={palette.background}
              title={option.title}
              subtitle={option.subtitle}
              selected={method === option.method}
              onPress={() => selectMethod(option.method)}
            />
          );
        })}
      </View>

      <View style={styles.section} accessibilityRole="radiogroup">
        <Typo size={16} fontWeight="700" color={theme.text.primary}>
          File category
        </Typo>
        {CATEGORY_OPTIONS.map((option) => (
          <OptionCard
            key={option.category}
            icon={GALLERY_ICON[option.category]}
            iconColor={theme.gallery[option.category].icon}
            title={option.title}
            subtitle={option.subtitle}
            selected={category === option.category}
            disabled={!!lockedCategory && lockedCategory !== option.category}
            onPress={() => setCategory(option.category)}
          />
        ))}
      </View>

      {/* Honest about where files live until uploads exist. */}
      <View style={[styles.note, { backgroundColor: theme.secondary.soft }]}>
        <Icon.InfoIcon size={scale(18)} color={theme.secondary.dark} weight="bold" />
        <Typo size={13} color={theme.text.primary} style={styles.noteText}>
          Files are kept on this phone only for now, and are cleared when you close the app.
        </Typo>
      </View>

      <Button
        title={category ? `Add to ${CATEGORY_TITLE[category]}` : 'Add to Gallery'}
        size="lg"
        loading={busy}
        disabled={!canSubmit}
        onPress={submit}
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacingY.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.lg,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: spacingY.md,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  noteText: {
    flex: 1,
  },
  submit: {
    borderRadius: radius.xl,
    minHeight: 56,
  },
});
