export function initMobileNav(): void {
  const bar = document.querySelector<HTMLElement>('md-navigation-bar#mobile-nav');
  if (!bar) return;

  const tabs = Array.from(bar.querySelectorAll('md-navigation-tab'));

  for (const tab of tabs) {
    const href = tab.getAttribute('href');
    if (!href) continue;

    tab.addEventListener('click', () => {
      if (href === location.pathname || href === location.pathname + '/') return;
      window.location.href = href;
    });
  }
}
