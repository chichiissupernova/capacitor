import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chichi: {
					purple: "#6712E9",            // Main brand purple
					"purple-dark": "#5100C2",     // Darker purple for hover
					"purple-light": "#8C4DFF",    // Lighter purple for links/hover
					"purple-soft": "#F2F0FF",     // Very soft lavender for hover backgrounds
					"purple-vivid": "#6712E9",    // Same as main for compatibility
					pink: "#D946EF",              // Keeping existing pink
					orange: "#FF6B00",            // Streak flame badge color
					"orange-light": "#FF8A50",    // Lighter orange for gradients
					blue: "#33C3F0",              // Keeping existing blue
					lime: "#CBFF00",              // Accent lime green for achievements/rewards
					text: "#1A1A1A",              // Primary text color
					"text-muted": "#6B6B6B",      // Secondary text color
					"card-bg": "#F9F9F9",         // Card background
					"card-hover": "#F2F0FF",      // Card hover background
					bronze: "#D68B4C",            // Bronze badge
					silver: "#B8BCC2",            // Silver badge
					gold: "#FFD700",              // Gold badge
					// Enhanced vibrant gradient colors for ADHD-friendly experience
					"fiery-orange": "#FF4500",    // More vibrant Fiery Orange
					"electric-magenta": "#FF1493", // More vibrant Electric Magenta
					"lime-glow": "#00FF00",       // More vibrant Lime Glow
					"deep-violet": "#4B0082",     // More vibrant Deep Violet
					// Additional energetic colors
					"cyber-blue": "#00FFFF",      // Energetic cyan
					"neon-pink": "#FF69B4"        // Energetic pink
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bounce-small': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'confetti': {
					'0%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
					'100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' }
				},
				// Enhanced vibrant gradient animation
				'chichi-vibrant-flow': {
					'0%': { 
						'background-position': '0% 50%',
						'background-size': '300% 300%'
					},
					'20%': { 
						'background-position': '100% 30%',
						'background-size': '400% 400%'
					},
					'40%': { 
						'background-position': '50% 100%',
						'background-size': '350% 350%'
					},
					'60%': { 
						'background-position': '20% 80%',
						'background-size': '450% 450%'
					},
					'80%': { 
						'background-position': '80% 20%',
						'background-size': '380% 380%'
					},
					'100%': { 
						'background-position': '0% 50%',
						'background-size': '300% 300%'
					}
				},
				// Pulse animation for extra energy
				'chichi-pulse': {
					'0%, 100%': { 
						opacity: '0.8',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '1',
						transform: 'scale(1.02)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-small': 'bounce-small 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'confetti': 'confetti 1s ease-out forwards',
				// Enhanced vibrant animations
				'chichi-vibrant': 'chichi-vibrant-flow 12s ease-in-out infinite',
				'chichi-pulse': 'chichi-pulse 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
