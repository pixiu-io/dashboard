import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import { getNamespaceList } from '@/services/kubernetes/namespaceService';
import { ElMessage } from 'element-plus';

export const useNamespaceStore = defineStore('namespapce', () => {
  const namespaces = ref([]);
  const defaultNamespace = ref('default');
  const list = async (cloud) => {
    const [result, err] = await getNamespaceList(cloud);
    if (err !== null) {
      return;
    }
    for (let ns of result.items) {
      namespaces.value.push(ns.metadata.name);
    }
  };
  const changeNamespace = (namespace) => {
    defaultNamespace.value = namespace;
  };
  return { list, changeNamespace, namespaces, defaultNamespace };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNamespaceStore, import.meta.hot));
}

export default useNamespaceStore;
