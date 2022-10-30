import { defineStore, acceptHMRUpdate } from 'pinia';
import { i18n } from '@/utils/i18n';

const useI18nStore = defineStore('i18n', () => {
  const changeLanguage = () => {
    if (i18n.global.locale.value === 'zh') {
      i18n.global.locale.value = 'en';
    } else {
      i18n.global.locale.value = 'zh';
    }
  };
  return { changeLanguage };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useI18nStore, import.meta.hot));
}
export default useI18nStore;
