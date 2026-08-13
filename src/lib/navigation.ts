export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function navigate(href: string) {
  if (isExternalHref(href)) {
    window.location.assign(href);
    return;
  }

  const url = new URL(href, window.location.origin);
  const nextPath = `${url.pathname}${url.search}${url.hash}`;
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextPath !== currentPath) {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (url.hash) {
    window.requestAnimationFrame(() => {
      document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
