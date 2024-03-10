import { defineStore, acceptHMRUpdate } from 'pinia';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref } from 'vue';
import { getClouds, deleteCloudById, changeCluserAliasName } from '@/services/cloudService';
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
  const editAliasName = ref(false);
  const selectCloudId = ref('');
  const selectCloudAliasName = ref('');
  const resourceVersion = ref(0);
  const showDeleteModal = ref(false);
  const preDeleteCloudName = ref('');
  const preDeleteCloudId = ref('');
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

    cloudList.value = result;
    total.value = result.length;
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
    editAliasName.value = false;
    selectCloudId.value = '';
    selectCloudAliasName.value = '';
    cloudType.value = 1;
    resourceVersion.value = 0;
  };

  const editAlias = (data) => {
    selectCloudId.value = data.id;
    selectCloudAliasName.value = data.alias_name;
    resourceVersion.value = data.resource_version;
    editAliasName.value = true;
  };

  const changeAliasName = async () => {
    await changeCluserAliasName(
      selectCloudId.value,
      resourceVersion.value,
      selectCloudAliasName.value,
    );

    editAliasName.value = false;
    resourceVersion.value = 0;
    selectCloudId.value = '';
    selectCloudAliasName.value = '';

    getCloudList();
  };
  //分页
  const onChange = (v) => {
    pageInfo.value.limit = 10;
    pageInfo.value.page = v.page;
    pageInfo.value.page_size = v.limit; //兼容原有写法
    getCloudList();
  };
  const jumpRoute = (row) => {
    localStorage.setItem(row.name, row.alias_name);

    router.push({
      name: 'Info',
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
  const cancelDeleteCloud = () => {
    showDeleteModal.value = false;
    preDeleteCloudName.value = '';
    preDeleteCloudId.value = '';
  };
  const confirmDeleteCloud = async () => {
    const [err, result] = await deleteCloudById(preDeleteCloudId.value);
    showDeleteModal.value = false;
    preDeleteCloudName.value = '';
    preDeleteCloudId.value = '';
    if (err) {
      return;
    }
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getCloudList();
  };
  const deleteCloud = (row) => {
    showDeleteModal.value = true;
    preDeleteCloudName.value = row.name;
    preDeleteCloudId.value = row.id;
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
    editAliasName,
    selectCloudAliasName,
    showDeleteModal,
    preDeleteCloudName,
    getCloudList,
    changeActive,
    onChange,
    createCloud,
    closeModal,
    jumpRoute,
    confirmCreateCloud,
    deleteCloud,
    editAlias,
    changeAliasName,
    cancelDeleteCloud,
    confirmDeleteCloud,
  };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot));
}

export default useCloudStore;
