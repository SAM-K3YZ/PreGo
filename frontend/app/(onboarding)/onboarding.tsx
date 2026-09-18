import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { Screen, Button } from '@/components/ui';
import { useRouter } from 'expo-router';
import Typo from '@/components/Typo';
import { verticalScale } from '@/utils/styling';
import { lightTheme, spacingX, spacingY, radius } from '@/constants/theme';

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

const onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
      setCurrentPage((prev) => prev + 1);
    } else {
      router.replace('/(auth)/sign-up');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/sign-up');
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
                  color={lightTheme.text.primary}
                  size={verticalScale(30)}
                  fontWeight={'bold'}
                >
                  {item.title}
                </Typo>
                <Typo
                  style={styles.subTitle}
                  color={lightTheme.text.secondary}
                  size={verticalScale(15)}
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
                    index === currentPage ? lightTheme.accent.default : lightTheme.border,
                  width: index === currentPage ? verticalScale(20) : verticalScale(8),
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentPage === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          style={{ borderRadius: radius.md }}
        />
      </View>
    </Screen>
  );
};

export default onboarding;

const styles = StyleSheet.create({
  slide: {
    width,
    paddingHorizontal: spacingX.xl,
    gap: spacingX.lg,
  },
  imgBg: {
    width: '100%',
    height: verticalScale(320),
    borderRadius: radius.xxl,
    backgroundColor: lightTheme.accent.tint,
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
  dot: {
    height: verticalScale(8),
    borderRadius: radius.xs,
  },
});
