import { defineStore, acceptHMRUpdate } from 'pinia';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref } from 'vue';
import { getClouds, deleteCloudById } from '@/services/cloudService';
import { router } from '@/router';
const useCloudStore = defineStore('cloud', () => {
  const pageInfo = ref({
    query: '',
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  });
  const loading = ref(false);
  const cloudList = ref([]);
  const cloudType = ref(1);
  const defaultOption = ref('无锡');
  const total = ref(0);
  const createCloudVisible = ref(false);
  const options = ref([
    {
      value: '无锡',
      label: '无锡',
    },
    {
      value: '宿迁',
      label: '宿迁',
    },
    {
      value: '杭州',
      label: '杭州',
      disabled: true,
    },
    {
      value: '泗阳',
      label: '泗阳',
    },
  ]);
  const getCloudList = async () => {
    loading.value = true;
    const [err, result] = await getClouds(pageInfo.value);
    loading.value = false;
    if (err) {
      return;
    }
    cloudList.value = result.data;
    total.value = result.total;
  };
  const changeActive = (value) => {
    cloudType.value = value;
  };
  const createCloud = () => {
    createCloudVisible.value = true;
    cloudType.value = 1;
  };
  const closeModal = () => {
    createCloudVisible.value = false;
    cloudType.value = 1;
  };
  //分页
  const onChange = (v) => {
    pageInfo.value.limit = 10;
    pageInfo.value.page = v.page;
    pageInfo.value.page_size = v.limit; //兼容原有写法
    getCloudList();
  };
  const jumpRoute = (row) => {
    router.push({
      name: 'Node',
      query: {
        cluster: row.name,
      },
    });
  };
  // 根据选择的类型跳转到不同操作页面
  const confirmCreateCloud = () => {
    const name = cloudType.value === 1 ? 'InsertCluster' : 'CreateCluster';
    createCloudVisible.value = false;
    router.push({
      name,
    });
  };
  const deleteCloud = (row) => {
    ElMessageBox.confirm('此操作将永久删除 ' + row.name + ' 集群. 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(async () => {
        const [err, result] = await deleteCloudById(row.id);
        if (err) {
          return;
        }
        ElMessage({
          type: 'success',
          message: '删除成功',
        });
        getCloudList();
      })
      .catch(() => {}); // 取消
  };
  return {
    pageInfo,
    options,
    cloudType,
    defaultOption,
    cloudList,
    loading,
    total,
    createCloudVisible,
    getCloudList,
    changeActive,
    onChange,
    createCloud,
    closeModal,
    jumpRoute,
    confirmCreateCloud,
    deleteCloud,
  };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot));
}

export default useCloudStore;
