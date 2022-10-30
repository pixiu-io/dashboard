import { createApp } from 'vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElIcons from '@element-plus/icons-vue';

import setupPinia from '@/stores';
import setupDirective from './directive';
import { setupI18n } from '@/utils/i18n';
import { setupRouter } from './router/index.js';
import axios from '@/utils/http';
// 全局引入css
import '@/assets/main.css';
// 引入 iconfont
// import "./assets/icon-font/iconfont.css";
import '@/assets/icon-font/iconfont';
import PixiuIcon from '@/components/pixiuIcon/index.vue';

const app = createApp(App);

for (const name in ElIcons) {
  app.component(name, ElIcons[name]);
} // 全局注册图标，用于处理动态图标展示

setupRouter(app); // 装载路由
setupPinia(app); // 装载状态管理
setupDirective(app); // 装载指令集
setupI18n(app); // 装载i18n

app.use(ElementPlus, {
  locale: zhCn,
});

app.component('PixiuIcon', PixiuIcon);

app.config.globalProperties.$http = axios;

app.mount('#app');
