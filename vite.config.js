import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: '/vue6.vue/', // 使用 GitHub Pages 專案路徑
  plugins: [vue(), vuetify()],
});
