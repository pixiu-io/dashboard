<template>
  <div>templates</div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { proxy } = getCurrentInstance();

const data = reactive({
  pageInfo: {
    query: '',
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },
  loading: false,

  nodeList: [],
});

onMounted(() => {
  nodeList();
});

const nodeList = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: '/clouds',
    data: data.pageInfo,
  });
  data.loading = false;

  data.nodeList = res.result.data;
};
</script>

<style scoped="scoped"></style>
