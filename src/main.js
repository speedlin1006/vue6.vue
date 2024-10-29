// main.js
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'; // 插件
import 'vuetify/styles'; // 樣式

createApp(App).use(vuetify).mount('#app');
