import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';

export default function Home() {
  return (
    <main className="min-h-screen bg-piloteer-void text-piloteer-ink flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <PiloteerLogo className="h-6 opacity-90" />
        <h1 className="mt-10 text-7xl font-bold tracking-editorial leading-none">Hunter</h1>
        <p className="mt-6 text-xl text-piloteer-metal">Intelligence before information.</p>
        <Link href="/teach" className="btn-primary mt-12 px-8 py-3.5">
          Open Hunter
        </Link>
      </div>
    </main>
  );
}
