import { defineStore, acceptHMRUpdate } from 'pinia';
import { createDeployment } from '@/services/kubernetes/deploymentService.js';
import { ElMessage } from 'element-plus';

export const useDeployment = defineStore('deployment', () => {
  const create = async (deployment) => {
    const [err, result] = await createDeployment(
      deployment,
      deployment.cloud,
      deployment.metadata.namespace,
      deployment.metadata.name,
    );
    if (err !== null) {
      return;
    }
    ElMessage({
      message: '新增成功',
      type: 'success',
    });
  };
  return { create };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeployment, import.meta.hot));
}
