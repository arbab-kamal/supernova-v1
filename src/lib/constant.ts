// Color theme constants for the application
export const colorThemes = {
  dark: {
    bg: {
      main: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E8EAED',
      tertiary: '#9AA0A6',
    },
    primary: {
      main: '#4285F4',
      gradient: '#3C4043',
    },
    border: '#3C4043',
    input: {
      bg: '#2D2D2D',
      border: '#5F6368',
    }
  },
  light: {
    bg: {
      main: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F4',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5F6368',
      tertiary: '#80868B',
    },
    primary: {
      main: '#4285F4',
      gradient: 'from-blue-600 to-blue-400',
    },
    border: '#DADCE0',
    input: {
      bg: '#F5F5F5',
      border: '#E8EAED',
    }
  }
};

// Helper function to get the current theme colors
export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? colorThemes.dark : colorThemes.light;
};