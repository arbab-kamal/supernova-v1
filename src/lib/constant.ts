export const COLORS = {
  light: {
    // Primary Colors
    primary: {
      main: "#4285F4", // Main blue color for buttons and key elements
      darker: "#3367D6",
      lighter: "#5C9CFF",
      gradient: {
        start: "#4285F4",
        middle: "#5B8DEF",
        end: "#739BE9",
      },
    },

    // Background Colors
    background: {
      main: "#FFFFFF", // Main background
      secondary: "#F8F9FA", // Secondary background
      tertiary: "#F1F3F4", // Tertiary background
      input: "#F5F5F5", // Input field background
    },

    // Text Colors
    text: {
      primary: "#1A1A1A", // Main text
      secondary: "#5F6368", // Secondary text
      tertiary: "#80868B", // Tertiary text
      disabled: "#BDC1C6",
      inverse: "#FFFFFF", // Text on dark backgrounds
    },

    // Border Colors
    border: {
      main: "#DADCE0",
      input: "#E8EAED",
      focus: "#4285F4",
    },

    // States
    states: {
      hover: "rgba(66, 133, 244, 0.04)",
      pressed: "rgba(66, 133, 244, 0.12)",
      selected: "rgba(66, 133, 244, 0.08)",
    },
  },

  dark: {
    // Primary Colors
    primary: {
      main: "#4285F4",
      darker: "#3367D6",
      lighter: "#5C9CFF",
      gradient: {
        start: "#1A237E", // Darker blue start
        middle: "#1E2993",
        end: "#2632A6",
      },
    },

    // Background Colors
    background: {
      main: "#121212", // Main background
      secondary: "#1E1E1E", // Secondary background
      tertiary: "#2D2D2D", // Tertiary background
      input: "#2D2D2D", // Input field background
    },

    // Text Colors
    text: {
      primary: "#FFFFFF", // Main text
      secondary: "#E8EAED", // Secondary text
      tertiary: "#9AA0A6", // Tertiary text
      disabled: "#5F6368",
      inverse: "#1A1A1A", // Text on light backgrounds
    },

    // Border Colors
    border: {
      main: "#3C4043",
      input: "#5F6368",
      focus: "#4285F4",
    },

    // States
    states: {
      hover: "rgba(255, 255, 255, 0.04)",
      pressed: "rgba(255, 255, 255, 0.12)",
      selected: "rgba(255, 255, 255, 0.08)",
    },
  },

  // Common colors that don't change between themes
  common: {
    error: "#D93025",
    warning: "#F29900",
    success: "#188038",
    info: "#1967D2",
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    socialMedia: {
      google: "#4285F4",
      facebook: "#1877F2",
      apple: "#000000",
    },
  },

  // Opacity levels
  opacity: {
    light: 0.04,
    medium: 0.08,
    heavy: 0.12,
    solid: 1,
  },

  // Gradient overlays
  overlays: {
    light: {
      primary:
        "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
      surface:
        "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
    },
    dark: {
      primary: "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))",
      surface: "linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))",
    },
  },
};

// Shadow definitions
export const SHADOWS = {
  light: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  dark: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
  },
};

// Spacing scale (in pixels)
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
};

// Border radius scale
export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

// Z-index scale
export const Z_INDEX = {
  negative: -1,
  0: 0,
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  max: 999,
};
