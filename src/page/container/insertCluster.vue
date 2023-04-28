<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <pixiu-card back="true" title="导入标准集群" height="50px" />
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 10px; width: 75%">
          <el-form :label-position="labelPosition" label-width="120px" :model="data.clusterForm">
            <div style="margin-top: 20px" />
            <el-form-item label="集群名称" style="width: 50%">
              <el-input v-model="data.clusterForm.alias_name" placeholder="请输入集群名称" />
            </el-form-item>

            <div style="margin-top: 30px" />
            <el-form-item label="所在地域" style="width: 100%">
              <el-radio-group v-model="data.clusterForm.region">
                <el-radio-button
                  v-for="(item, index) in data.regionOptions"
                  :key="index"
                  :label="item.label"
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
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :limit="1"
                :file-list="data.kubeconfig"
                :auto-upload="false"
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">将 kubeconfig 拖到此处，或 <em>点击上传</em></div>
              </el-upload>

              <el-row>
                <el-button
                  type="text"
                  style="margin-left: 20px; margin-top: 130px"
                  @click="connectKubernetes"
                  >连通检查</el-button
                >
              </el-row>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="高性能 eventer">
              <el-switch
                v-model="data.clusterForm.enable_pixiu_eventer"
                active-text="启用"
                inactive-text="关闭"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              启用 pixiu-eventer 组件，提供高性能的 kubernetes 事件查询能力
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

            <div style="margin-top: 18px" />
            <el-form-item label="创建系统空间">
              <el-radio v-model="data.clusterForm.create_ns" label="enabled">是</el-radio>
              <el-radio v-model="data.clusterForm.create_ns" disabled>否</el-radio>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              在 kubernetes 集群中创建 pixiu-system 命名空间，用于运行 pixiu 的系统组件和配置
            </div>

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
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  clusterForm: {
    alias_name: '',
    region: '无锡',
    description: '',
    create_ns: 'enabled', // 创建 pixiu 的系统命名空间
    enable_pixiu_eventer: false, // 启用高性能事件收集器
    cloud_type: 1, // 导入集群的类型为 1

    allowCreated: true, // 仅在前端生效
  },
  kubeconfig: [],

  // 后续从后端获取
  regionOptions: [
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
    },
    {
      value: '泗阳',
      label: '泗阳',
    },
    {
      value: '苏州',
      label: '苏州',
    },
    {
      value: '南京',
      label: '南京',
    },
    {
      value: '上海',
      label: '上海',
    },
    {
      value: '北京',
      label: '北京',
    },
  ],
});

const labelPosition = ref('left');

const comfirmCreate = async () => {
  if (data.kubeconfig.length == 0) {
    return proxy.$message.error('failed to found the kubeConfig file.');
  }

  const configFile = data.kubeconfig[0].raw;
  const fileFormData = new FormData();
  fileFormData.append('kubeconfig', configFile, configFile.name);
  fileFormData.append('clusterData', new Blob([JSON.stringify(data.clusterForm)]), {
    type: 'application/json',
  });

  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const resp = await proxy.$http({
      method: 'post',
      url: '/load/cloud',
      data: fileFormData,
      config: requestConfig,
    });
  } catch (error) {}

  proxy.$message.success(`集群 ${data.clusterForm.name} 导入成功`);
  backToContainer();
};

const cancelCreate = () => {
  backToContainer();
};

const connectKubernetes = async () => {
  if (data.kubeconfig.length == 0) {
    return proxy.$message.error('failed to found the kubeConfig file.');
  }

  const configFile = data.kubeconfig[0].raw;
  const fileFormData = new FormData();
  fileFormData.append('kubeconfig', configFile, configFile.name);
  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const resp = await proxy.$http({
      method: 'post',
      url: '/clouds/ping',
      data: fileFormData,
      config: requestConfig,
    });

    proxy.$message.success('kubernetes 集群连接正常');
    data.clusterForm.allowCreated = false;
  } catch (error) {}
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: 'Container',
  });
};

const handleChange = (file, files) => {
  data.kubeconfig = files;
};

const beforeRemove = (file, files) => proxy.$confirm(`确定移除 ${file.name}？`);
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
