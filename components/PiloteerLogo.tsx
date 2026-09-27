import Image from 'next/image';

export default function PiloteerLogo({ className = "h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Piloteer"
      width={120}
      height={32}
      className={className}
      priority
    />
  );
}
