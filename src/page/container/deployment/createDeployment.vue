<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Deployment</div>
  </el-card>

  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 16px; width: 100%">
          <el-form :label-position="labelPosition" label-width="120px" :model="data.clusterForm">
            <div style="margin-top: 20px" />
            <el-form-item label="名称" style="width: 40%">
              <el-input v-model="data.deploymentForm.metadata.name" />
            </el-form-item>

            <div style="margin-top: 30px" />
            <el-form-item label="命名空间" style="width: 100%">
              <el-radio-group v-model="data.deploymentForm.metadata.namespace">
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

            <div class="app-pixiu-describe" style="margin-top: -12px">
              启用 pixiu-eventer 组件，提供高性能的 kubernetes 事件查询能力
            </div>

            <div style="margin-top: 40px" />
            <el-form-item>
              <el-button type="primary" @click="comfirmCreate()">完成</el-button>
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
  regionOptions: [],

  deploymentForm: {
    kind: '',
    apiVersion: 'apps/v1',
    metadata: {
      name: '',
      namespace: '',
      labels: {},
    },
    spec: {
      replicas: 0,
      selector: {
        matchLabels: {},
      },
      template: {
        metadata: {
          labels: {},
        },
        spec: {
          containers: [],
        },
      },
    },
  },
});

const labelPosition = ref('left');

const comfirmCreate = async () => {
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

.title-card-container {
  height: 50px;
  margin-top: -20px;
  margin-left: -20px;
  margin-right: -20px;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}
</style>
