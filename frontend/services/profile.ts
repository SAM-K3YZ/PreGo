import { format, subDays } from 'date-fns';
import type { ProfileDetails } from '@/types';

// Temporary record until the profile API is connected. The conception date is
// relative to today so the dummy pregnancy always reads as week 22.
export async function getProfile(): Promise<ProfileDetails> {
  return {
    fullName: 'Adaeze Okonkwo',
    email: 'adaeze@email.com',
    phone: '+234 801 234 5678',
    conceptionDate: format(subDays(new Date(), 22 * 7 - 14), 'yyyy-MM-dd'),
    bloodType: 'O+',
    hospitals: [
      {
        id: 'lagos-island-general',
        name: 'Lagos Island General Hospital',
        shortName: 'Lagos Island',
        location: 'Lagos Island, Lagos',
      },
    ],
  };
}
