import { Image, View } from 'react-native';
import Typo from '@/components/Typo';
import { spacingX, spacingY } from '@/constants/theme';
import { scale } from '@/utils/styling';

// App logo + PREGO wordmark, shared across the onboarding auth screens.
const AuthHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX.sm,
        marginBottom: spacingY.xl,
      }}
    >
      <Image
        source={require('../assets/images/prego_logo.png')}
        style={{ width: scale(32), height: scale(32) }}
        resizeMode="contain"
      />
      <Typo fontWeight="800" size={18}>
        PREGO
      </Typo>
    </View>
  );
};

export default AuthHeader;
