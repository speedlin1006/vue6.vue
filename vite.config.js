import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vue6.vue/' : '/', // 本地為 '/'，部署為 '/vue6.vue/'
  plugins: [vue(), vuetify()],
});
