import type { Config } from "tailwindcss";

/**
 * Leather Wind design tokens.
 *
 * The palette is intentionally small and strictly hierarchical:
 *   espresso  — anchor surfaces, footer, hero overlays
 *   leather   — secondary dark surfaces, borders on dark
 *   cognac    — the single accent, reserved for primary actions
 *   charcoal  — body copy on light surfaces
 *   ivory     — the default page background
 *   sand      — quiet panels, dividers, image placeholders
 *   white     — maximum-contrast copy on dark surfaces
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: "#241914",
        leather: "#3A2921",
        cognac: "#A66B45",
        charcoal: "#302C29",
        ivory: "#F7F3ED",
        sand: "#E7DCCE",
        white: "#FFFFFF",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        // Editorial display scale. Line heights are generous on purpose.
        "display-xl": ["clamp(2.75rem, 6.5vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.6vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.875rem, 3.2vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 2.4vw, 2rem)", { lineHeight: "1.18", letterSpacing: "-0.005em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.22em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.75" }],
        body: ["1rem", { lineHeight: "1.75" }],
        "body-sm": ["0.875rem", { lineHeight: "1.7" }],
        caption: ["0.75rem", { lineHeight: "1.6", letterSpacing: "0.06em" }],
      },
      maxWidth: {
        prose: "68ch",
        content: "80rem",
      },
      spacing: {
        section: "clamp(4.5rem, 9vw, 8.5rem)",
        gutter: "clamp(1.25rem, 4vw, 3rem)",
      },
      borderRadius: {
        // Deliberately restrained. The brand reads as tailored, not bubbly.
        card: "2px",
        control: "2px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(36, 25, 20, 0.04), 0 12px 28px -24px rgba(36, 25, 20, 0.35)",
        raised: "0 18px 45px -30px rgba(36, 25, 20, 0.55)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      keyframes: {
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-rise": "fade-rise 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
