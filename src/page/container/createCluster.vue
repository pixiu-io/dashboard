<template>
    <el-main>
      <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
        <div class="app-pixiu-header-title">创建标准集群</div>
      </el-card>
      <div>创建</div>
    </el-main>
  </template>

  <script setup>
  import { reactive, getCurrentInstance } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import PixiuRadioCard from "@/components/radioCard/index.vue";
  const { proxy } = getCurrentInstance();
  const data = reactive({
    loading: false,
  });

  const jumpRoute = (row) => {
    proxy.$router.push({
      name: "Kubernetes",
      params: {
        id: row.id,
        name: row.name,
      },
    });
  };
  </script>

  <style scoped="scoped">
  .box-card {
    margin-top: 20px;
  }

  .el-main {
    background-color: #f3f4f7;
  }

  .app-pixiu-header-title {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    font-size: 16px;
    font-weight: 700;
    margin-right: 20px;
    max-width: 70%;
  }
  </style>
