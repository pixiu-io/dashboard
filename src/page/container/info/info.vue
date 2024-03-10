<template>
  <el-card class="title-card-container">
    <div class="font-container">集群概览</div>
  </el-card>

  <dev class="one-line-style">
    <el-card class="content1-card-container"> 集群信息</el-card>
    <el-card class="content2-card-container"> 集群资源使用情况</el-card>
  </dev>
  <div><el-card class="content3-card-container"> 核心组件状态</el-card></div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';
const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const data = reactive({
  cluster: '',
  clusterForm: {
    name: '',
    alias_name: '',
    cluster_type: 0,
    protected: true,
    kubernetes_version: '',
    gmt_create: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getCluster();
});

const getCluster = async () => {};
</script>

<style>
.content1-card-container {
  height: 400px;
  width: 38%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}

.content2-card-container {
  height: 400px;
  width: 100%;
  margin-top: 25px;
  margin-left: 25px;
  margin-right: 10px;
  border-radius: 0px;
}

.content3-card-container {
  height: 380px;
  width: 98.5%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}
</style>
