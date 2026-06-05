module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Moti Design Tokens
        moti: {
          navy: "#0B1E3D",
          "navy-dark": "#071529",
          "navy-mid": "#132843",
          "navy-light": "#1B3A5C",
          sky: "#1E6FD9",
          "sky-light": "#3B8EF0",
          "sky-pale": "#EAF3FE",
          amber: "#F59E0B",
          "amber-dark": "#D97706",
          "amber-light": "#FCD34D",
          coral: "#EF4444",
          "coral-light": "#FCA5A5",
          mint: "#10B981",
          "mint-light": "#6EE7B7",
          slate: "#94A3B8",
          "slate-dark": "#64748B",
          "slate-pale": "#F1F5F9",
          white: "#FFFFFF",
          "off-white": "#F8FAFC",
          card: "rgba(255,255,255,0.06)",
          "card-hover": "rgba(255,255,255,0.10)",
          glass: "rgba(11,30,61,0.72)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        roboto: ["Inter", "ui-sans-serif", "system-ui"],
        poppins: ["Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "card": "0 2px 16px 0 rgba(11,30,61,0.13)",
        "card-hover": "0 8px 40px 0 rgba(11,30,61,0.22)",
        "glow-sky": "0 0 24px 0 rgba(30,111,217,0.25)",
        "glow-amber": "0 0 24px 0 rgba(245,158,11,0.30)",
        "premium": "0 4px 32px 0 rgba(11,30,61,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
        "nav": "0 -4px 24px 0 rgba(11,30,61,0.35)",
        "header": "0 4px 24px 0 rgba(11,30,61,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-down": "slide-down 0.25s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
