export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = 'auto') {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
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
      window.requestAnimationFrame(() => scrollToHash(url.hash));
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
