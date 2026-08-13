import { company } from '../../content/company';
import { navigation } from '../../content/navigation';
import { RouteLink } from '../ui/RouteLink';

export function SiteFooter() {
  return (
    <footer className="lt-footer">
      <div className="lt-shell lt-footer-grid">
        <div>
          <RouteLink className="lt-logo-link" href="/" aria-label="LionTech Innovations home">
            <img src={company.logo} alt="LionTech Innovations" />
          </RouteLink>
          <p>{company.description}</p>
          <p className="lt-footer-trust">{company.serviceArea}</p>
        </div>

        <div>
          <h2>Explore</h2>
          <div className="lt-footer-links">
            {navigation.slice(0, 6).map((item) => (
              <RouteLink key={item.href} href={item.href}>{item.label}</RouteLink>
            ))}
          </div>
        </div>

        <div>
          <h2>Contact</h2>
          <div className="lt-footer-links">
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <span>{company.location}</span>
            <RouteLink href="/privacy-policy">Privacy Policy</RouteLink>
            <RouteLink href="/terms-and-conditions">Terms and Conditions</RouteLink>
          </div>
        </div>
      </div>

      <div className="lt-shell lt-footer-bottom">
        <span>© 2026 {company.legalName}</span>
        <span>Registered in England and Wales. No. {company.companiesHouseNumber}</span>
      </div>
    </footer>
  );
}
