import { createI18n } from 'vue-i18n';
import messages from '@/language';

const language = (
  navigator.language ? navigator.language : navigator.userLanguage || 'zh'
).toLowerCase();

const i18n = createI18n({
  fallbackLocale: 'zh', // 预设语言环境
  globalInjection: true,
  legacy: false, // you must specify 'legacy: false' option
  locale: language.split('-')[0] || 'zh', // 默认显示的语言
  messages, // 本地化的语言环境信息。
});

const setupI18n = (app) => {
  app.use(i18n);
};
export { setupI18n, i18n };
