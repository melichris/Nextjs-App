// Runs before hydration to avoid a flash of the wrong theme (FOUC).
// Reads the saved preference, falling back to the OS-level preference
// if the user has never toggled it manually.
export const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;
