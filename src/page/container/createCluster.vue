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
        <el-card style="width: 97%">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
            :model="data.clusterForm"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="集群名称" style="width: 50%">
              <el-input
                v-model="data.clusterForm.name"
                placeholder="请输入集群名称"
              />
            </el-form-item>

            <div style="margin-top: 25px" />
            <el-form-item label="Kubernetes 版本">
              <el-select v-model="data.clusterForm.kubernetes_version">
                <el-option
                  v-for="item in data.kubernetes_version_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              当前已支持 kubernetes 版本有: 1.18、1.20，1.22 版本。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="所在地域" style="width: 100%">
              <el-radio-group v-model="data.clusterForm.region">
                <el-radio-button
                  :label="item.label"
                  v-for="item in data.regionOptions"
                />
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe">
              处在不同地域的云产品内网不通，导入后无法更换。建议选择合适的地域，以提高使用体验。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="容器运行时">
              <el-radio-group v-model="data.clusterForm.kubernetes_runtime">
                <el-radio-button label="docker">docker</el-radio-button>
                <el-radio-button label="containerd">containerd</el-radio-button>
                <el-radio-button label="cri-O" disabled>cri-O</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              pixiu 支持的容器运行时，目前支持 docker 和 containerd， cri-O
              计划被支持，近请期待。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="容器网络插件">
              <el-radio-group v-model="data.clusterForm.cni">
                <el-radio-button label="calico">calico</el-radio-button>
                <el-radio-button label="flannel">flannel</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              选择 kubernetes 集群 pod 网络类型，一经选择无法更改，推荐使用
              flannel。
            </div>

            <div style="margin-top: 20px" />
            <el-form-item label="集群描述" style="width: 60%">
              <el-input
                v-model="data.clusterForm.description"
                placeholder="请输入 Kubernentes 集群描述"
                type="textarea"
                :autosize="data.autosize"
              />
            </el-form-item>

            <div style="margin-top: 40px" />
            <el-form-item>
              <el-button
                type="primary"
                :disabled="data.clusterForm.allowCreated"
                @click="comfirmCreate()"
                >完成</el-button
              >
              <el-button @click="cancelCreate()">取消</el-button>
            </el-form-item>
          </el-form>
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
    kubernetes_version: "1.20.0",
    kubernetes_runtime: "docker",
    cni: "flannel", // 默认网络插件

    allow_created: true, // 仅在前端生效
  },

  kubernetes_version_options: [
    {
      value: "1.22.6",
      label: "1.22.6",
    },
    {
      value: "1.20.0",
      label: "1.20.0",
    },
  ],

  regionOptions: [
    {
      value: "无锡",
      label: "无锡",
    },
    {
      value: "宿迁",
      label: "宿迁",
    },
    {
      value: "杭州",
      label: "杭州",
    },
    {
      value: "泗阳",
      label: "泗阳",
    },
    {
      value: "苏州",
      label: "苏州",
    },
    {
      value: "南京",
      label: "南京",
    },
    {
      value: "上海",
      label: "上海",
    },
    {
      value: "北京",
      label: "北京",
    },
  ],
});

const labelPosition = ref("left");

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
