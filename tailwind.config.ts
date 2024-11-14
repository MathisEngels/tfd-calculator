import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "#030621",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "#80878d",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				tfd: {
					DEFAULT: "#0f172a",
					accent: "#1e293b",
					accent2: "#090e25",
				},
			},
			backgroundImage: {
				"tfd-module-standard": "linear-gradient(130deg,#3d6c8c 10%,#000 46%,#000 54%,#3d6c8c 90%)",
				"tfd-module-rare": "linear-gradient(130deg,#511e7a 10%,#1a1a1a 46%,#1a1a1a 54%,#511e7a 90%)",
				"tfd-module-ultimate": "linear-gradient(130deg,#988b5e 10%,#1a1a1a 46%,#1a1a1a 54%,#988b5e 90%)",
				"tfd-module-transcendent": "linear-gradient(150deg,#843e2f 10%,#1a1a1a 46%,#1a1a1a 54%,#843e2f 90%)",
				"tfd-grad-standard": "linear-gradient(180deg,rgba(80,143,181,.793),#0f172a 17%)",
				"tfd-grad-rare": "linear-gradient(180deg,rgba(81, 30, 122, .79),#0f172a 17%)",
				"tfd-grad-ultimate": "linear-gradient(180deg,rgba(152,139,94,.79),#0f172a 17%)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
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
		},
	},
	plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")({ nocompatible: true, preferredStrategy: "pseudoelements" })],
};
export default config;
