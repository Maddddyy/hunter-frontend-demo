import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-piloteer-void via-piloteer-black-alt to-piloteer-void">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-16 text-center">
          <div className="space-y-8">
            <PiloteerLogo className="h-10 mx-auto opacity-90" />
            
            <div className="space-y-6 pt-6">
              <h1 className="text-6xl md:text-7xl font-bold tracking-editorial text-piloteer-ink leading-tight">
                Hunter
              </h1>
              <p className="text-2xl md:text-3xl text-piloteer-metal font-medium max-w-3xl mx-auto leading-relaxed">
                Intelligence before information.
              </p>
              <p className="text-lg text-piloteer-metal max-w-2xl mx-auto leading-relaxed">
                The sales performance system that augments seller judgment in the moment it matters.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Link 
              href="/teach"
              className="group relative bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface border border-piloteer-hair hover:border-piloteer-hair-2 rounded-2xl p-10 transition-all hover:transform hover:-translate-y-1 block max-w-xl mx-auto"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-piloteer-ink">
                  Open Hunter
                </h3>
                <p className="text-base text-piloteer-metal leading-relaxed">
                  Start with Teach to configure your sales model, then access the Console companion for live selling and Performance dashboard for intelligence.
                </p>
              </div>
              <div className="mt-6 text-sm font-mono uppercase tracking-wider text-piloteer-metal group-hover:text-piloteer-ink transition-colors">
                Launch Application →
              </div>
            </Link>

            <div className="max-w-2xl mx-auto pt-8">
              <div className="border-t border-piloteer-hair pt-6 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">
                  Frontend Demo
                </div>
                <p className="text-sm text-piloteer-metal leading-relaxed">
                  Mock data only. Piloteer AE Emma Dixon selling Hunter into TechCorp Global — a fictional enterprise buyer. 
                  Full vision prototype demonstrating editorial clarity, evidence-backed intelligence, and seller judgment first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
