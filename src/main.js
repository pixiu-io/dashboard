import { createApp } from 'vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElIcons from '@element-plus/icons-vue';
import router from './router/index.js';
import { pinia } from '@/stores';
import { permissionDirective } from '@/directive';
import axios from '@/utils/http';
import i18n from '@/utils/i18n';
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

app.use(pinia); // 使用状态管理
app.directive('permissions', permissionDirective); // 新增权限指令v-permissions

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(i18n);
app.component('PixiuIcon', PixiuIcon);

app.config.globalProperties.$http = axios;

app.mount('#app');
