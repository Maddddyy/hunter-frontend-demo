import Image from 'next/image';

export default function PiloteerLogo({ 
  className = "h-8", 
  variant = "light" 
}: { 
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Image
      src={variant === "dark" ? "/logo-dark.svg" : "/logo.svg"}
      alt="Piloteer"
      width={120}
      height={32}
      className={className}
      priority
    />
  );
}
