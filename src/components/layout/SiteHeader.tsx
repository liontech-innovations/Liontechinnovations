import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getActiveNavigationHref, navigation } from '../../content/navigation';
import { PrimaryCta } from '../ui/PrimaryCta';
import { RouteLink } from '../ui/RouteLink';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));

  const activeHref = getActiveNavigationHref(currentLocation.pathname, currentLocation.hash);

  useEffect(() => {
    const updateLocation = () => setCurrentLocation({
      pathname: window.location.pathname,
      hash: window.location.hash,
    });

    window.addEventListener('popstate', updateLocation);
    window.addEventListener('hashchange', updateLocation);
    return () => {
      window.removeEventListener('popstate', updateLocation);
      window.removeEventListener('hashchange', updateLocation);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="lt-site-header">
      <div className="lt-header-inner">
        <RouteLink className="lt-logo-link" href="/" aria-label="LionTech Innovations home">
          <img src="/assets/liontechlogo.png" alt="LionTech Innovations" className="nav-logo" />
        </RouteLink>

        <nav className="lt-desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <RouteLink
              key={item.href}
              href={item.href}
              className={activeHref === item.href ? 'is-active' : undefined}
              aria-current={activeHref === item.href ? 'page' : undefined}
            >
              {item.label}
            </RouteLink>
          ))}
        </nav>

        <div className="lt-header-action">
          <PrimaryCta label="Get AI Snapshot" />
        </div>

        <button
          type="button"
          className="lt-menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="lt-mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <RouteLink
              key={item.href}
              href={item.href}
              className={activeHref === item.href ? 'is-active' : undefined}
              aria-current={activeHref === item.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </RouteLink>
          ))}
          <PrimaryCta label="Get AI Snapshot" />
        </nav>
      )}
    </header>
  );
}
