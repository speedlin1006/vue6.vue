import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: '/', // 設置為根目錄
  plugins: [vue(), vuetify()],
});
