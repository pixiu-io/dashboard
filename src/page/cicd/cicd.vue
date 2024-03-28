<template>
  <el-input v-model="data.cluster" placeholder="请输入集群名称" />
  <el-input v-model="data.namespace" placeholder="请输入命名空间" />
  <el-button @click="getTasks">查询</el-button>
</template>

<script setup lang="jsx">
import { getTaskList } from '@/services/devops/taskService';
import { reactive } from 'vue';

const data = reactive({
  cluster: '',
  namespace: 'default',
  taskList: [],
});

const getTasks = async () => {
  const [res, err] = await getTaskList(data.cluster, data.namespace);
  if (err) {
    console.error(err);
    return;
  }

  data.taskList = res.data;
};
</script>
