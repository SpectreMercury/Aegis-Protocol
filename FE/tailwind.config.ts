import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: "hsl(20 5.9% 90%)",
  			input: "hsl(20 5.9% 90%)",
  			ring: "hsl(24 97% 54%)",
  			background: "hsl(0 0% 100%)",
  			foreground: "hsl(20 6% 10%)",
  			primary: {
  				DEFAULT: "hsl(24 97% 54%)",
  				foreground: "hsl(0 0% 100%)",
  			},
  			secondary: {
  				DEFAULT: "hsl(20 5.9% 90%)",
  				foreground: "hsl(24 10% 10%)",
  			},
  			destructive: {
  				DEFAULT: "hsl(0 84.2% 60.2%)",
  				foreground: "hsl(0 0% 98%)",
  			},
  			muted: {
  				DEFAULT: "hsl(20 5.9% 96%)",
  				foreground: "hsl(20 5.9% 40%)",
  			},
  			accent: {
  				DEFAULT: "hsl(20 5.9% 96%)",
  				foreground: "hsl(24 10% 10%)",
  			},
  			popover: {
  				DEFAULT: "hsl(0 0% 100%)",
  				foreground: "hsl(20 6% 10%)",
  			},
  			card: {
  				DEFAULT: "hsl(0 0% 100%)",
  				foreground: "hsl(20 6% 10%)",
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
