const colors = {
  primary: "#E85D2F",
  primaryLight: "#FFF0EB",
  primaryDark: "#C44A20",

  dark: "#1A1A1A",
  text: "#2D2D2D",
  textMuted: "#8A8A8A",

  background: "#F9F7F4",
  white: "#FFFFFF",

  success: "#4CAF72",
  successLight: "#E8F5EE",

  border: "#EBEBEB",
  disabled: "#F2F2F2",
};

const fonts = {
  heading: "Poppins",
  body: "Inter",
};

const fontSizes = {
  h1: 32,
  h2: 22,
  h3: 17,
  h4: 14,
  body: 15,
  small: 13,
  label: 12,
  caption: 11,
};

const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const radius = {
  badge: 4,
  input: 8,
  button: 12,
  card: 16,
  bottomSheet: 24,
  full: 999,
};

const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  primary: {
    shadowColor: "#E85D2F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
};

export { colors, fonts, fontSizes, fontWeights, radius, shadows, spacing };

