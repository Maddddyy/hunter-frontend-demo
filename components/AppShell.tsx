'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PiloteerLogo from './PiloteerLogo';
import { NavIcons } from './icons';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Teach', href: '/teach', Icon: NavIcons.Teach },
    { label: 'Console', href: '/console', Icon: NavIcons.Console },
    { label: 'Dashboard', href: '/dashboard', Icon: NavIcons.Dashboard },
    { label: 'Reports', href: '/reports', Icon: NavIcons.Reports },
    { label: 'Analytics', href: '/analytics', Icon: NavIcons.Analytics },
    { label: 'Settings', href: '/settings', Icon: NavIcons.Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href || pathname?.startsWith('/dashboard/');
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen flex bg-piloteer-void">
      {/* Primary Left Nav - Always Visible */}
      <nav className="w-64 border-r border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-plane flex flex-col">
        <div className="p-6 border-b border-piloteer-hair">
          <Link href="/">
            <PiloteerLogo className="h-7 opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="mt-2 text-xs font-mono uppercase tracking-wider text-piloteer-mute">
            Hunter
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive(item.href)
                    ? 'bg-piloteer-surface-3 text-piloteer-ink border border-piloteer-hair-2'
                    : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                }`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-piloteer-hair">
          <div className="text-xs font-mono text-piloteer-mute text-center">
            Hunter v0.1.0
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
