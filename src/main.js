import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import router from "./router/index.js";
import * as ElIcons from "@element-plus/icons-vue";
import { pinia } from "@/store";
import { permissionDirective } from "@/directive";
import axios from "@/utils/http";
// 全局引入css
import "../style/apps.css";

const app = createApp(App);

for (const name in ElIcons) {
  app.component(name, ElIcons[name]);
} // 全局注册图标，用于处理动态图标展示

app.use(pinia); // 使用状态管理
app.directive("permissions", permissionDirective); // 新增权限指令v-permissions

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);

app.config.globalProperties.$http = axios;

app.mount("#app");
