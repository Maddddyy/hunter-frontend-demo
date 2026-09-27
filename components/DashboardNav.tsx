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
    <nav className="border-b border-piloteer-surface bg-piloteer-black-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <PiloteerLogo className="h-8" />
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-piloteer-surface text-white'
                      : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-piloteer-gray hover:text-white transition-colors">
            Ask Hunter
          </button>
        </div>
      </div>
    </nav>
  );
}
