import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <PiloteerLogo className="h-12 mx-auto" />
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Hunter</h1>
          <p className="text-xl text-piloteer-gray">
            The Sales Performance System
          </p>
          <p className="text-piloteer-gray max-w-xl mx-auto">
            Real-time guidance during live interactions. Evidence-based intelligence. 
            Seller judgment first, always.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto pt-8">
          <Link href="/teach" className="btn-primary text-center">
            Teach Hunter
          </Link>
          <Link href="/console" className="btn-secondary text-center">
            Open Console
          </Link>
          <Link href="/dashboard" className="btn-secondary text-center">
            Seller Dashboard
          </Link>
          <Link href="/dashboard/manager" className="btn-secondary text-center">
            Manager Dashboard
          </Link>
          <Link href="/dashboard/cro" className="btn-secondary text-center">
            CRO Dashboard
          </Link>
        </div>

        <div className="pt-8 text-sm text-piloteer-gray border-t border-piloteer-surface max-w-md mx-auto">
          <p className="mb-2">Frontend Demo</p>
          <p className="text-xs">
            Mock data only. Piloteer selling Hunter into TechCorp Global (fictional enterprise buyer).
          </p>
        </div>
      </div>
    </main>
  );
}
