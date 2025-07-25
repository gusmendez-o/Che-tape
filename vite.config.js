import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginGhPages from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/Che-tape/',  // poné el nombre exacto de tu repo en GitHub
  plugins: [react(), vitePluginGhPages()],
});
