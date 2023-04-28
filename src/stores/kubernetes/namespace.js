import { defineStore, acceptHMRUpdate } from 'pinia';
import { listNamespaces } from '@/services/kubernetes/namespaceService.js';
import { ElMessage } from 'element-plus';

export const useNamespaceStore = defineStore('namespapce', () => {
  const list = async (namespace) => {
    const [err, result] = await listNamespaces(namespace.cloud);
    if (err !== null) {
      return;
    }
  };
  return { list };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNamespaceStore, import.meta.hot));
}

export default useNamespaceStore;
