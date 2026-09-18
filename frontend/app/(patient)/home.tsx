import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/apiEndpoints';
import { getTrimester, calculateDeliveryDate, getCountdown } from '../../utils/trimesterCalc';
import { PatientProfile } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import HomeSkeleton from '@/components/home/HomeSkeleton';

export default function Home() {
  const theme = useTheme();
  const { data: patient } = useQuery<PatientProfile>({
    queryKey: ['patient-me'],
    queryFn: async () => (await apiClient.get(ENDPOINTS.PATIENTS.ME)).data,
  });

  if (!patient?.conceptionDate) {
    return <HomeSkeleton />;
  }

  const trimester = getTrimester(patient.conceptionDate);
  const deliveryDate = calculateDeliveryDate(patient.conceptionDate);
  const { days } = getCountdown(deliveryDate);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background.app }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text.primary }}>
        Hello, {patient.fullName}
      </Text>
      <Text style={{ marginTop: 8, color: theme.text.secondary }}>
        {trimester} trimester · {days} days to go
      </Text>
      {/* TODO: quick-action cards (Log Symptom, Log Weight, Medications, Meditate) */}
    </View>
  );
}
