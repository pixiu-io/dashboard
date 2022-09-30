<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <pixiu-card title="导入标准集群" height="50px" />
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 30px; width: 75%">
          <el-form
            :label-position="labelPosition"
            label-width="110px"
            :model="data.clusterForm"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="集群名称" style="width: 30%">
              <el-input
                v-model="data.clusterForm.name"
                placeholder="请输入集群名称"
              />
            </el-form-item>

            <div style="margin-top: 30px" />
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

            <div style="margin-top: 20px" />
            <el-form-item label="KubeConfig">
              <el-upload
                drag
                multiple
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :limit="1"
                :file-list="data.clusterForm.kubeconfig"
                :auto-upload="false"
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  将 kubeconfig 拖到此处，或 <em>点击上传</em>
                </div>
                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
              </el-upload>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="集群描述" style="width: 50%">
              <el-input
                v-model="data.clusterForm.description"
                placeholder="请输入 Kubernentes 集群描述"
                type="textarea"
                :autosize="data.autosize"
              />
            </el-form-item>

            <div style="margin-top: 18px" />
            <el-form-item label="创建系统空间">
              <el-radio v-model="data.clusterForm.create_ns" label="enabled"
                >是</el-radio
              >
              <el-radio v-model="data.clusterForm.create_ns" disabled
                >否</el-radio
              >
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              在 kubernetes 集群中创建 pixiu-system 命名空间，用于运行 pixiu
              的系统组件和配置
            </div>

            <div style="margin-top: 40px" />
            <el-form-item>
              <el-button type="primary" @click="comfirmCreate()"
                >完成</el-button
              >
              <el-button @click="cancelCreate()">取消</el-button>
            </el-form-item>
          </el-form>
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
    minRows: 4,
  },

  clusterForm: {
    name: "",
    region: "无锡",
    description: "",
    create_ns: "enabled", // 创建 pixiu 的系统命名空间
    kubeconfig: "",
  },

  // 后续从后端获取
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

const comfirmCreate = () => {
  console.log("create");
  backToContainer();
};

const cancelCreate = () => {
  console.log("cancel");
  backToContainer();
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: "Container",
  });
};

const handleChange = (file, files) => {
  data.clusterForm.kubeconfig = file;
};

const beforeRemove = (file, files) => {
  return proxy.$confirm(`确定移除 ${file.name}？`);
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
  margin-left: 110px;
  font-size: 12px;
  color: #888888;
}
</style>
