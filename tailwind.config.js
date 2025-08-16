/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ["var(--font-press-start)", "monospace"],
        vt323: ["var(--font-vt323)", "monospace"],
        inter: ["Inter", "system-ui", "sans-serif"],
        sora: ["Sora", "system-ui", "sans-serif"],
        pixelify: ["var(--font-pixelify)", "sans-serif"],
        silkscreen: ["var(--font-silkscreen)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        "hotdog-bun": "var(--hotdog-bun)",
        ketchup: "var(--ketchup)",
        mustard: "var(--mustard)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "float-more-delayed": "float 6s ease-in-out infinite 4s",
        "pixel-firework": "pixelFirework 2s ease-out forwards",
        "gradient-shift": "gradientShift 15s ease infinite",
        "float-hotdog": "float-hotdog 8s ease-in-out infinite",
        "bounce-bun": "bounce-bun 6s ease-in-out infinite",
        "rotate-mustard": "rotate-mustard 10s linear infinite",
        sparkle: "sparkle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        pixelFirework: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "0" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float-hotdog": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg) scale(1)" },
          "25%": { transform: "translateY(-15px) rotate(2deg) scale(1.05)" },
          "50%": { transform: "translateY(-25px) rotate(0deg) scale(1.1)" },
          "75%": { transform: "translateY(-15px) rotate(-2deg) scale(1.05)" },
        },
        "bounce-bun": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.1)" },
        },
        "rotate-mustard": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
      },
      backgroundImage: {
        "hotdog-gradient":
          "linear-gradient(135deg, var(--ketchup) 0%, var(--mustard) 50%, var(--hotdog-bun) 100%)",
        "glass-pattern":
          "radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 217, 61, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 10%, rgba(255, 140, 66, 0.1) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};
