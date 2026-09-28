'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type DealView = 'read' | 'follow';

type DealPaneValue = {
  dealId: string | null;
  view: DealView;
  openDeal: (id: string, view?: DealView) => void;
  closeDeal: () => void;
};

const DealPaneContext = createContext<DealPaneValue | null>(null);

export function DealPaneProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dealId, setDealId] = useState<string | null>(null);
  const [view, setView] = useState<DealView>('read');

  useEffect(() => {
    const match = pathname?.match(/^\/dashboard\/deals\/([^/]+)$/);
    if (!match) {
      setDealId(null);
      return;
    }
    setDealId(decodeURIComponent(match[1]));
    const params = new URLSearchParams(window.location.search);
    setView(params.get('view') === 'follow' ? 'follow' : 'read');
  }, [pathname]);

  const openDeal = useCallback((id: string, next: DealView = 'read') => {
    setDealId(id);
    setView(next);
    if (pathname?.match(/^\/dashboard\/deals\/[^/]+$/) && pathname !== `/dashboard/deals/${id}`) {
      router.replace(next === 'follow' ? `/dashboard/deals/${id}?view=follow` : `/dashboard/deals/${id}`);
    }
  }, [pathname, router]);

  const closeDeal = useCallback(() => {
    setDealId(null);
    if (pathname?.match(/^\/dashboard\/deals\/[^/]+$/)) {
      router.replace('/dashboard/deals');
    }
  }, [pathname, router]);

  return (
    <DealPaneContext.Provider value={{ dealId, view, openDeal, closeDeal }}>
      {children}
    </DealPaneContext.Provider>
  );
}

export function useDealPane() {
  const value = useContext(DealPaneContext);
  if (!value) throw new Error('useDealPane must be used within DealPaneProvider');
  return value;
}
