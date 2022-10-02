<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <pixiu-card title="创建标准集群" height="50px" />
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 10px; width: 75%">
          <el-form> </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import PixiuCard from "@/components/card/index.vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  clusterForm: {
    name: "",
    region: "无锡",
    description: "",
    create_ns: "enabled", // 创建 pixiu 的系统命名空间
    enable_pixiu_eventer: false, // 启用高性能事件收集器
    cloud_type: "1", // 导入集群的类型为 1

    allowCreated: true, // 仅在前端生效
  },
});

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
