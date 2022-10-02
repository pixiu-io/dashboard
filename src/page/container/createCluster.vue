<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: #f3f4f7;
    "
  >
    <pixiu-card title="创建标准集群" height="50px" />
    <el-steps
      :active="data.active"
      finish-status="success"
      simple
      align-center
      style="margin-top: 15px; margin-left: -70px"
    >
      <el-step title="集群信息" />
      <el-step title="节点选择" />
      <el-step title="节点配置" />
      <el-step title="组件配置" />
      <el-step title="信息确认" />
    </el-steps>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 10px; width: 97%">
          <el-form> </el-form>
        </el-card>
      </div>
    </el-main>

    <span style="margin-left: 20%">
      <el-button @click="cancelCreate()">取消</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </span>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import { Edit, Picture, UploadFilled } from "@element-plus/icons-vue";

import PixiuCard from "@/components/card/index.vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  active: 1, // 步骤条展示

  clusterForm: {
    name: "",
    create_ns: true, // 创建 pixiu 的系统命名空间
    enable_pixiu_eventer: false, // 启用高性能事件收集器
    cloud_type: "1", // 导入集群的类型为 1
    region: "无锡",
    description: "",

    allow_created: true, // 仅在前端生效
  },
});

const next = () => {
  if (data.active++ > 4) data.active = 1;
};
const comfirmCreate = async () => {};

const cancelCreate = () => {
  backToContainer();
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: "Container",
  });
};
</script>

<style scoped="scoped">
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.el-main {
  background-color: #f3f4f7;
}

.app-pixiu-describe {
  margin-left: 120px;
  font-size: 12px;
  color: #888888;
}
</style>
