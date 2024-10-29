// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  base: '/', // 根路徑部署，若在子路徑，如 `/app/` 則修改為 `/app/`
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // 啟用 vuetify 插件並設置自動引入
  ],
})
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/你的repo名稱/' : '/'
};

