import { create } from 'zustand';

type ThemeState = {
  isDark: boolean;        // Tracks whether dark mode is active
  toggleTheme: () => void; // Function to switch between dark and light mode
};

// Get initial theme from localStorage or default to light mode
const getInitialTheme = (): boolean => {
  const saved = localStorage.getItem('Team');
  return saved === null ? false : saved === 'true';
};

// Apply theme styles to the document body
const applyThemeToBody = (isDark: boolean) => {
  document.body.style.backgroundColor = isDark ? '#081B29' : '#ffffff'; 
  document.body.style.color = isDark ? '#ffffff' : '#000000';
};

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme();
  applyThemeToBody(initialTheme); // Apply theme on store initialization

  return {
    isDark: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = !state.isDark;
        localStorage.setItem('Team', newTheme.toString()); // Save preference
        applyThemeToBody(newTheme); // Apply updated theme to body
        return { isDark: newTheme }; // Update state in store
      }),
  };
});
