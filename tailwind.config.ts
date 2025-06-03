import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          text: 'var(--neutral-text)',
          main: 'var(--neutral-main)',
          mid: 'var(--neutral-mid)',
          light: 'var(--neutral-light)',
          background: 'var(--neutral-background)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
