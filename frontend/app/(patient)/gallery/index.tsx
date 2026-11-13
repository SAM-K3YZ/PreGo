import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Button, Screen } from '@/components/ui';
import GalleryItemModal from '@/components/gallery/GalleryItemModal';
import GalleryTile from '@/components/gallery/GalleryTile';
import PrescriptionRow from '@/components/gallery/PrescriptionRow';
import { GALLERY_TABS } from '@/components/gallery/galleryVisuals';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useGallery } from '@/hooks/useGallery';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import { useGalleryUiStore } from '@/store/useGalleryUiStore';
import type { GalleryItem } from '@/types';

const FAB_SIZE = 56;

export default function Gallery() {
  const theme = useTheme();
  const { data: allItems = [], isPending, isError, refetch } = useGallery();
  const pull = usePullToRefresh(refetch);
  const category = useGalleryUiStore((s) => s.category);
  const setCategory = useGalleryUiStore((s) => s.setCategory);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const items = allItems.filter((item) => item.category === category);

  return (
    <View style={styles.root}>
      <Screen scroll style={styles.container} {...pull}>
        {/* header */}
        <View style={styles.header}>
          <Typo size={24} fontWeight="700" color={theme.text.primary}>
            My Gallery
          </Typo>
          <View style={styles.privacy}>
            <Typo size={14} fontWeight="600" color={theme.secondary.dark}>
              Only visible to you
            </Typo>
          </View>
        </View>

        {/* category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityRole="tablist"
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabs}
        >
          {GALLERY_TABS.map((tab) => {
            const active = tab.category === category;
            return (
              <Pressable
                key={tab.category}
                onPress={() => setCategory(tab.category)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? theme.accent.default : theme.background.card,
                    borderColor: active ? theme.accent.default : theme.border,
                  },
                ]}
              >
                <Typo
                  size={14}
                  fontWeight="600"
                  color={active ? theme.text.onAccent : theme.text.secondary}
                >
                  {tab.label}
                </Typo>
              </Pressable>
            );
          })}
        </ScrollView>

        {isPending && <ActivityIndicator color={theme.accent.default} />}

        {isError && (
          <View style={styles.state}>
            <Typo color={theme.text.secondary}>Couldn't load your gallery.</Typo>
            <Button title="Try again" onPress={() => refetch()} />
          </View>
        )}

        {!isPending && !isError && (
          <>
            <Typo size={13} color={theme.text.secondary}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Typo>
            {category === 'prescription' ? (
              <View style={styles.list}>
                {items.map((item) => (
                  <PrescriptionRow key={item.id} item={item} onPress={() => setSelected(item)} />
                ))}
              </View>
            ) : (
              <View style={styles.grid}>
                {items.map((item) => (
                  <GalleryTile key={item.id} item={item} onPress={() => setSelected(item)} />
                ))}
              </View>
            )}
          </>
        )}
      </Screen>

      <Pressable
        onPress={() => router.push('/gallery/add')}
        accessibilityRole="button"
        accessibilityLabel="Add to gallery"
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: pressed ? theme.accent.pressed : theme.accent.default,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <Icon.PlusIcon size={scale(24)} color={theme.text.onAccent} weight="bold" />
      </Pressable>

      <GalleryItemModal item={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    gap: spacingY.lg,
    paddingBottom: FAB_SIZE + spacingY.xxl,
  },
  header: {
    gap: spacingY.xs,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.xs,
  },
  // A ScrollView grows by default, which stretches the pills to fill the screen.
  tabsScroll: {
    flexGrow: 0,
  },
  tabs: {
    gap: spacingX.sm,
    alignItems: 'center',
  },
  tab: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacingX.xl,
    borderWidth: 1.5,
    borderRadius: radius.full,
  },
  state: {
    gap: spacingY.md,
    alignItems: 'center',
  },
  list: {
    gap: spacingY.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacingY.md,
  },
  fab: {
    position: 'absolute',
    right: spacingX.xl,
    bottom: spacingY.md,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
