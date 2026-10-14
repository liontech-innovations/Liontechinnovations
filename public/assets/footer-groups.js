// Native details remain usable without JavaScript; match the shared React footer at each breakpoint.
const footerGroups = document.querySelectorAll('.lt-compact-footer details');
const footerDesktop = window.matchMedia('(min-width: 768px)');
const updateFooterGroups = () => footerGroups.forEach(group => { group.open = footerDesktop.matches; });
updateFooterGroups();
footerDesktop.addEventListener('change', updateFooterGroups);
