import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-16 text-center">
          <div className="space-y-6">
            <PiloteerLogo className="h-8 mx-auto opacity-90" />
            
            <div className="space-y-4 pt-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-editorial text-piloteer-ink leading-tight">
                Hunter
              </h1>
              <p className="text-xl md:text-2xl text-piloteer-metal font-medium max-w-2xl mx-auto leading-relaxed">
                Intelligence before information. The sales performance system that augments seller judgment in the moment it matters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto pt-8">
            <Link 
              href="/console"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-8 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  For Sellers
                </div>
                <h3 className="text-xl font-bold text-piloteer-ink">
                  Console
                </h3>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Prepare for calls, sense live interactions, complete follow-through
                </p>
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                Open →
              </div>
            </Link>

            <Link 
              href="/dashboard"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-8 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  For Sellers
                </div>
                <h3 className="text-xl font-bold text-piloteer-ink">
                  Seller Dashboard
                </h3>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Book momentum, needs you, patterns shaping your deals
                </p>
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                View →
              </div>
            </Link>

            <Link 
              href="/dashboard/manager"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-8 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  For Managers
                </div>
                <h3 className="text-xl font-bold text-piloteer-ink">
                  Manager Dashboard
                </h3>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Team book momentum, where to intervene, patterns across the team
                </p>
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                View →
              </div>
            </Link>

            <Link 
              href="/dashboard/cro"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-8 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  For Revenue Leaders
                </div>
                <h3 className="text-xl font-bold text-piloteer-ink">
                  CRO Dashboard
                </h3>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Revenue momentum, systemic patterns, organizational actions
                </p>
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                View →
              </div>
            </Link>

            <Link 
              href="/teach"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-8 transition-all hover:transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  For Revenue Leaders
                </div>
                <h3 className="text-xl font-bold text-piloteer-ink">
                  Teach Hunter
                </h3>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Guided onboarding — teach Hunter how your company sells
                </p>
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                Start →
              </div>
            </Link>
          </div>

          <div className="pt-16 max-w-2xl mx-auto">
            <div className="border-t border-piloteer-hair pt-8 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                Frontend Demo
              </div>
              <p className="text-sm text-piloteer-metal leading-relaxed">
                Mock data only. Piloteer selling Hunter into TechCorp Global — a fictional enterprise buyer. 
                Full vision prototype demonstrating editorial clarity, evidence-backed intelligence, and seller judgment first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
