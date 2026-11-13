import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { useRef, useState, useMemo } from 'react';
import type { Href } from 'expo-router';
import { Screen, Button } from '@/components/ui';
import { useRouter } from 'expo-router';
import Typo from '@/components/Typo';
import type { Theme } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { verticalScale } from '@/utils/styling';
import { spacingX, spacingY, radius } from '@/constants/theme';
import { markOnboardingCompleted } from '@/services/onboardingFlag';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Track your pregnancy health',
    subTitle: 'Log symtopms, weight, and mood daily. Get gentle',
    image: require('../../assets/images/track_pregnancy.png'),
  },
  {
    id: '2',
    title: 'Connect with your doctor securely',
    subTitle:
      'Message your antenatal care team, book appointments, and share health updates safely.',
    image: require('../../assets/images/chat_with_doc.png'),
  },
  {
    id: '3',
    title: 'Access support anytime',
    subTitle:
      'Resources, meditation guides, and community support — available 24/7, whenever you need them.',
    image: require('../../assets/images/access_support.png'),
  },
];

const Onboarding = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const finishing = useRef(false);
  const router = useRouter();
  const lastIndex = onboardingData.length - 1;
  const isLastSlide = currentPage === lastIndex;

  const handleNext = () => {
    if (currentPage < lastIndex) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Skip goes to the last slide, so the user still sees both choices.
  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: lastIndex });
    setCurrentPage(lastIndex);
  };

  // Onboarding only counts as done once the user picks sign up or sign in.
  const finish = async (href: Href) => {
    if (finishing.current) return;
    finishing.current = true;
    try {
      await markOnboardingCompleted();
    } catch {
      // Navigate anyway; at worst onboarding shows once more next launch.
    }
    router.replace(href);
  };

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" title="Skip" onPress={handleSkip} />
      </View>

      <View style={{ flex: 1 }}>
        {/* slides */}
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          data={onboardingData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(page);
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.imgBg}>
                <Image source={item.image} style={styles.img} />
              </View>
              <View style={styles.textArea}>
                <Typo
                  style={styles.title}
                  color={theme.text.primary}
                  size={30}
                  fontWeight={'bold'}
                >
                  {item.title}
                </Typo>
                <Typo
                  style={styles.subTitle}
                  color={theme.text.secondary}
                  size={15}
                  fontWeight={'normal'}
                >
                  {item.subTitle}
                </Typo>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentPage ? theme.accent.default : theme.border,
                  width: index === currentPage ? verticalScale(20) : verticalScale(8),
                },
              ]}
            />
          ))}
        </View>

        {isLastSlide ? (
          <View style={styles.actions}>
            <Button
              title="Get started"
              accessibilityRole="button"
              accessibilityLabel="Get started, create an account"
              onPress={() => finish('/(auth)/sign-up')}
              style={{ borderRadius: radius.md }}
            />
            <Button
              title="I already have an account"
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel="I already have an account, sign in"
              onPress={() => finish('/(auth)/sign-in')}
            />
          </View>
        ) : (
          <Button title="Continue" onPress={handleNext} style={{ borderRadius: radius.md }} />
        )}
      </View>
    </Screen>
  );
};

export default Onboarding;

// Built per theme so colours follow light/dark mode.
const createStyles = (theme: Theme) =>
  StyleSheet.create({
  slide: {
    width,
    paddingHorizontal: spacingX.xl,
    gap: spacingX.lg,
  },
  imgBg: {
    width: '100%',
    height: verticalScale(320),
    borderRadius: radius.xxl,
    backgroundColor: theme.accent.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  textArea: {
    gap: spacingY.sm,
    alignItems: 'flex-start',
  },
  title: {
    textAlign: 'left',
  },
  subTitle: {
    textAlign: 'left',
    lineHeight: verticalScale(19.5),
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: spacingX.xl,
    paddingBottom: spacingY.xxl,
    paddingTop: spacingY.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacingX.xl,
    paddingTop: spacingY.sm,
    marginBottom: spacingY.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: spacingX.xs,
    marginBottom: spacingY.xl,
  },
  actions: {
    gap: spacingY.sm,
  },
  dot: {
    height: verticalScale(8),
    borderRadius: radius.xs,
  },
});
