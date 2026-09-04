import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Logo({
  className = '',
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow transition-transform duration-300 group-hover:scale-105">
        <ShieldCheck className="h-5 w-5 text-ink-950" strokeWidth={2.5} />
      </span>
      {showText && (
        <span className="font-display text-lg font-extrabold tracking-tight text-white">
          {siteConfig.brandName}
        </span>
      )}
    </Link>
  );
}
