'use client';

import { DealPaneProvider } from '@/lib/dealPane';
import { FollowProvider } from '@/lib/followThrough';
import { PersonaProvider } from '@/lib/persona';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <FollowProvider>
        <DealPaneProvider>{children}</DealPaneProvider>
      </FollowProvider>
    </PersonaProvider>
  );
}
