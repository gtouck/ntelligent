import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import tools from '@/utils/tools';
import i18n from '@/locales/index';
import router from './router';
import store from './store';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import './permission';
import 'element-plus/dist/index.css';
import 'amfe-flexible';

const app = createApp(App);

window._log = tools.log;
// 定义全部变量
//app.config.globalProperties
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(i18n);
app.use(router);
app.use(store);
app.mount('#app');
