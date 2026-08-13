import { ArrowUpRight } from 'lucide-react';
import { publicEnv } from '../../config/publicEnv';
import { RouteLink } from './RouteLink';

type PrimaryCtaProps = {
  className?: string;
  label?: string;
};

export function PrimaryCta({ className = '', label = 'See What AI Says About Your Business' }: PrimaryCtaProps) {
  return (
    <RouteLink className={`lt-button lt-button-primary ${className}`} href={publicEnv.snapshotCtaUrl}>
      <span>{label}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.75} />
    </RouteLink>
  );
}
