// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import site from './src/data/site.json' with { type: 'json' };

export default defineConfig({
  // Endereço público do site (usado no sitemap, no canonical e no Open Graph). Troque em src/data/site.json.
  site: site.url,
  output: 'static',
  // Páginas que viraram parte de outras; os endereços antigos continuam funcionando
  redirects: {
    '/como-chegar': '/contato', // "Como chegar" agora está no Contato
    '/avaliacoes': '/#avaliacoes', // avaliações agora estão na aba "A casa"
  },
  integrations: [icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
