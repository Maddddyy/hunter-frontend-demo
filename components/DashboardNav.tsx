'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PiloteerLogo from './PiloteerLogo';
import { NavIcons } from './icons';

export default function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Performance', href: '/dashboard', Icon: NavIcons.Dashboard },
    { label: 'Deals', href: '/dashboard/deals', Icon: NavIcons.Reports },
    { label: 'Team', href: '/dashboard/manager', Icon: NavIcons.Console },
    { label: 'Settings', href: '/settings', Icon: NavIcons.Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-piloteer-void">
      {/* Top Nav */}
      <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-plane">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <PiloteerLogo className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
              <span className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Hunter</span>
            </Link>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive(item.href)
                        ? 'bg-piloteer-surface-3 text-piloteer-ink'
                        : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ask Hunter - always accessible */}
          <button className="flex items-center gap-2 px-4 py-2 bg-piloteer-surface-2 hover:bg-piloteer-surface-3 border border-piloteer-hair rounded-lg text-sm font-semibold text-piloteer-ink transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Ask Hunter</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
