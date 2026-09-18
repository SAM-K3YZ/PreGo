import { StyleSheet, View } from 'react-native';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { spacingX, spacingY } from '@/constants/theme';
import Screen from '@/components/ui/Screen';

const LogSkeleton = () => {
  return (
    <Screen scroll>
      <View style={styles.top}>
        <Card style={{ width: '50%' }}>
          <Skeleton width="50%" height={30} borderRadius={12} />
          <Skeleton width="68%" height={18} borderRadius={8} style={{ marginTop: spacingY.md }} />
        </Card>

        <Card style={{ width: '20%' }}>
          <Skeleton width="100%" height={50} borderRadius={12} />
        </Card>
      </View>

      <Card style={{ marginTop: spacingY.xxl, padding: spacingX.lg }}>
        <Skeleton width="100%" height={140} borderRadius={18} />
      </Card>

      <View>
        <View
          style={{ flexDirection: 'row', marginTop: spacingY.lg, justifyContent: 'space-between' }}
        >
          <Card style={{ width: '48%', padding: spacingX.lg }}>
            <Skeleton width="80%" height={18} borderRadius={8} />
            <Skeleton
              width="100%"
              height={40}
              borderRadius={12}
              style={{ marginTop: spacingY.md }}
            />
          </Card>

          <Card style={{ width: '48%', padding: spacingX.lg }}>
            <Skeleton width="80%" height={18} borderRadius={8} />
            <Skeleton
              width="100%"
              height={40}
              borderRadius={12}
              style={{ marginTop: spacingY.md }}
            />
          </Card>
        </View>

        <View
          style={{ flexDirection: 'row', marginTop: spacingY.lg, justifyContent: 'space-between' }}
        >
          <Card style={{ width: '48%', padding: spacingX.lg }}>
            <Skeleton width="80%" height={18} borderRadius={8} />
            <Skeleton
              width="100%"
              height={40}
              borderRadius={12}
              style={{ marginTop: spacingY.md }}
            />
          </Card>

          <Card style={{ width: '48%', padding: spacingX.lg }}>
            <Skeleton width="80%" height={18} borderRadius={8} />
            <Skeleton
              width="100%"
              height={40}
              borderRadius={12}
              style={{ marginTop: spacingY.md }}
            />
          </Card>
        </View>
      </View>

      <Card style={{ marginTop: spacingY.lg, padding: spacingX.lg, marginBottom: spacingY.sm }}>
        <Skeleton width="60%" height={18} borderRadius={8} />
        <Skeleton width="100%" height={52} borderRadius={12} style={{ marginTop: spacingY.md }} />
        <Skeleton width="100%" height={52} borderRadius={12} style={{ marginTop: spacingY.sm }} />
      </Card>
    </Screen>
  );
};

export default LogSkeleton;

const styles = StyleSheet.create({
  top: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  }, 
});
