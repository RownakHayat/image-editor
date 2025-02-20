import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
        bangla: ["var(--font-ruposhiBangla)"],
      },
      screens: {
        xs: "480px", // Add your custom xs breakpoint here
        xss: "276px", // Add your custom xs breakpoint here
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        primary: "#2B7D74",
        secondary: "rgba(32, 108, 107, 1)",
        headerbg: "#F0FAF4",
        warning: "#F0953E",
        inactive: "#C20005",
        success: "#0B9E45",
        danger: "#F9EEEC",
        textColor: "#8B8B8B",
        textColorSecond: "#646464",
        borderColor: "#Gray-sd-5",
      },
      backgroundColor: {
        "gradient-custom-purple": "#0CB04D",
        "gradient-light-purple": "#0CB04D",
      },
      // backgroundImage: {
      //   'gradient-custom-purple': 'linear-gradient(to right, #0CB04D, rgba(255, 255, 255, 0.1))',
      //   'gradient-light-purple': 'linear-gradient(to right, rgba(115, 103, 240, 0.8), rgba(158, 149, 245, 0.5))'
      // },
      // Adding page break utilities
      pageBreakAfter: {
        always: "always",
        avoid: "avoid",
        auto: "auto",
        left: "left",
        right: "right",
      },
      pageBreakBefore: {
        always: "always",
        avoid: "avoid",
        auto: "auto",
        left: "left",
        right: "right",
      },
      pageBreakInside: {
        avoid: "avoid",
        auto: "auto",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add plugin to handle new utilities
    function ({
      addUtilities,
    }: {
      addUtilities: (
        utilities: Record<string, any>,
        options?: { variants?: string[] | undefined }
      ) => void;
    }) {
      addUtilities(
        {
          ".page-break-after": { pageBreakAfter: "always" },
          ".page-break-before": { pageBreakBefore: "always" },
          ".page-break-inside": { pageBreakInside: "avoid" },
        },
        { variants: ["responsive", "print"] }
      );
    },
  ],
};

export default config;
