import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic":
          "radial-gradient(at 21% 11%, rgba(186, 186, 233, 0.53) 0, transparent 50%), radial-gradient(at 85% 0, hsla(46, 57%, 78%, 0.52) 0, transparent 50%), radial-gradient(at 91% 36%, rgba(194, 213, 255, 0.68) 0, transparent 50%), radial-gradient(at 8% 40%, rgba(251, 218, 239, 0.46) 0, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
