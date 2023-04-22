<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Deployment</div>
  </el-card>

  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 16px; width: 100%">
          <el-form :label-position="labelPosition" label-width="120px">
            <div style="margin-top: 20px" />
            <el-form-item label="名称" style="width: 40%">
              <el-input v-model="data.deploymentForm.metadata.name" />
              <div class="app-pixiu-describe">
                最长63个字符，只能包含小写字母、数字及分隔符(“-")
              </div>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="命名空间" style="width: 20%">
              <div class="namespace-select-container">
                <el-select
                  v-model="data.deploymentForm.metadata.namespace"
                  style="width: 80%"
                  @change="changeNamespace"
                >
                  <el-option
                    v-for="item in data.namespaces"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
            </el-form-item>

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
import { reactive, getCurrentInstance, onMounted, watch } from 'vue';

import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  cluser: '',
  namespaces: [],
  autosize: {
    minRows: 5,
  },
  regionOptions: [],

  deploymentForm: {
    kind: '',
    apiVersion: 'apps/v1',
    metadata: {
      name: '',
      namespace: 'default',
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

const comfirmCreate = async () => {
  try {
    const resp = await proxy.$http({
      method: 'post',
      url: `/proxy/pixiu/${data.cluser}/api/v1/namespaces`,
      data: fileFormData,
    });
  } catch (error) {}

  proxy.$message.success(`集群 ${data.clusterForm.name} 导入成功`);
  backToContainer();
};

const cancelCreate = () => {
  backToContainer();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cloud.cluster + '/api/v1/namespaces',
    });

    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
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
  font-size: 10px;
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
