<template>
  <el-input v-model="data.cluster" placeholder="请输入集群名称" />
  <el-input v-model="data.namespace" placeholder="请输入命名空间" />
  <el-button @click="getTasks">查询</el-button>
  <el-table :data="data.taskList">
    <el-table-column prop="name" label="任务名称" />
    <el-table-column prop="status" label="任务状态" />
    <el-table-column prop="createTime" label="创建时间" />
  </el-table>
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
