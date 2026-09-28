'use client';

import DashboardNav from '@/components/DashboardNav';
import DealsScreen from '@/components/DealsScreen';

export default function DealRoute() {
  return (
    <DashboardNav>
      <DealsScreen />
    </DashboardNav>
  );
}
