import type { Config } from 'tailwindcss'
import sharedConfig from '@llamaindex/tailwind-config'

const config: Pick<Config, 'content' | 'presets' | 'theme'> = {
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
    },
  },
}

export default config
