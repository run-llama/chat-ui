import type { Config } from 'tailwindcss'
import sharedConfig from '@llamaindex/tailwind-config'

const config: Pick<
  Config,
  'content' | 'presets' | 'theme' | 'darkMode' | 'plugins'
> = {
  darkMode: ['class'],
  content: [
    'app/**/*.{ts,tsx}',
    'node_modules/@llamaindex/chat-ui/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      backgroundImage: {
        'glow-conic':
          'radial-gradient(at 21% 11%, rgba(186, 186, 233, 0.53) 0, transparent 50%), radial-gradient(at 85% 0, hsla(46, 57%, 78%, 0.52) 0, transparent 50%), radial-gradient(at 91% 36%, rgba(194, 213, 255, 0.68) 0, transparent 50%), radial-gradient(at 8% 40%, rgba(251, 218, 239, 0.46) 0, transparent 50%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
