import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://aqarzain.github.io',
  base: '/aqar-zain',
  trailingSlash: 'always',

  integrations: [tailwind()],

  vite: {
    define: {
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(
        process.env.PUBLIC_API_URL || 'http://localhost:3000'
      ),
    },
  },

  compressHTML: true,
});
