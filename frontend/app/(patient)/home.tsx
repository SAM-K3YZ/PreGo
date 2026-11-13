import { getGestation } from '@/utils/gestation';
import { usePatient } from '@/hooks/usePatient';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTheme } from '@/hooks/useTheme';
import HomeSkeleton from '@/components/home/HomeSkeleton';
import { Button, Screen } from '@/components/ui';
import Typo from '@/components/Typo';

export default function Home() {
  const theme = useTheme();
  const { data: patient, isPending, isError, refetch } = usePatient();
  const pull = usePullToRefresh(refetch);

  if (isPending) return <HomeSkeleton />;

  if (isError) {
    return (
      <Screen center {...pull}>
        <Typo color={theme.text.secondary}>Couldn't load your details.</Typo>
        <Button title="Try again" onPress={() => refetch()} style={{ marginTop: 16 }} />
      </Screen>
    );
  }

  if (!patient.conceptionDate) {
    return (
      <Screen center {...pull}>
        <Typo color={theme.text.secondary}>
          Add your conception date to see your pregnancy progress.
        </Typo>
      </Screen>
    );
  }

  const gestation = getGestation(patient.conceptionDate);
  if (!gestation) {
    return (
      <Screen center {...pull}>
        <Typo color={theme.text.secondary}>
          Your saved conception date doesn't look right. Please check it in your profile.
        </Typo>
      </Screen>
    );
  }

  const { weeks, days, trimester, status, daysToGo, postTerm } = gestation;

  const countdownText = postTerm
    ? 'You are past 42 weeks. Please contact your care team.'
    : status === 'due-today'
      ? 'Your estimated due date is today'
      : status === 'overdue'
        ? 'Past your estimated due date. Contact your care team.'
        : `${daysToGo} ${daysToGo === 1 ? 'day' : 'days'} to go`;

  return (
    <Screen {...pull}>
      <Typo size={22} fontWeight="bold" color={theme.text.primary}>
        Hello, {patient.fullName}
      </Typo>
      <Typo color={theme.text.secondary} style={{ marginTop: 8 }}>
        {weeks}w {days}d · {trimester} trimester
      </Typo>
      <Typo color={theme.text.secondary} style={{ marginTop: 4 }}>
        {countdownText}
      </Typo>
      {/* TODO: quick-action cards (Log Symptom, Log Weight, Medications, Meditate) */}
    </Screen>
  );
}
