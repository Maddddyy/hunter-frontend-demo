'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PiloteerLogo from './PiloteerLogo';

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Performance', href: '/dashboard' },
    { label: 'Deals', href: '/dashboard/deals' },
    { label: 'Team', href: '/dashboard/team' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-plane to-piloteer-void backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/">
              <PiloteerLogo className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold font-mono uppercase tracking-wider transition-all ${
                    pathname === item.href
                      ? 'bg-piloteer-surface-3 text-piloteer-ink'
                      : 'text-piloteer-mute hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-semibold font-mono uppercase tracking-wider ctx hover:text-piloteer-ink transition-colors">
            Ask Hunter
          </button>
        </div>
      </div>
    </nav>
  );
}
