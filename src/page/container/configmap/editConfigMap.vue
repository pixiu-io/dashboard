<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <span> ConfigMap :</span>
      <span> {{ data.configmapForm.metadata.name }} </span>
      <span>({{ data.configmapForm.metadata.namespace }})</span>
      <span> / 更新配置</span>
    </div>
  </el-card>

  <div
    class="configmap-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 8px; width: 80%; border-radius: 0px">
          <template #header>
            <el-descriptions
              class="no-border"
              title="基本信息"
              :direction="vertical"
              :column="1"
              width="100%"
              border
            >
              <el-descriptions-item label="所在地域">华东地区(南京)</el-descriptions-item>
              <el-descriptions-item label="集群ID">
                {{ data.configmapForm.metadata.uid }}
              </el-descriptions-item>
              <el-descriptions-item label="所在命名空间">
                {{ data.configmapForm.metadata.namespace }}
              </el-descriptions-item>
              <el-descriptions-item label="资源名称">
                {{ data.configmapForm.metadata.name }}
              </el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <div>
              <el-table :data="data.tableData" style="width: 100%" max-height="250">
                <el-table-column prop="key" label="变量名" width="120" />
                <el-table-column prop="value" label="变量值" width="auto" />
                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="deleteRow(scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">手动增加</el-button>
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">文件导入</el-button>
            </div>
          </template>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';

import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  cluser: '',
  namespaces: [],
  autosize: {
    minRows: 5,
  },

  configmapLabels: [],

  // configmap 创建初始对象
  configmapForm: {
    metadata: {
      name: '',
      namespace: 'default',
      uid: '-',
    },
    data: {},
  },
  tableData: [
    {
      ket: '1',
      value: '22',
    },
  ],
  configmapFormData: {
    data: {
      key: '',
      value: '',
    },
  },
});

const handleChange = (value) => {
  data.configmapForm.spec.replicas = value;
};

const comfirmCreate = async () => {
  data.configmapForm.spec.selector.matchLabels['pixiu.io/app'] = data.configmapForm.metadata.name;
  data.configmapForm.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
  data.configmapForm.spec.template.metadata.labels = data.configmapForm.spec.selector.matchLabels;

  for (let i = 0; i < data.deploymentLabels.length; i++) {
    data.configmapForm.spec.template.metadata.labels[data.deploymentLabels[i].key] =
      data.deploymentLabels[i].value;
  }

  try {
    const resp = await proxy.$http({
      method: 'post',
      url:
        `/proxy/pixiu/${data.cloud.cluster}/apis/apps/v1/namespaces/` +
        data.configmapForm.metadata.namespace +
        `/deployments`,
      data: data.configmapForm,
    });
  } catch (error) {}

  proxy.$message.success(`deployment ${data.configmapForm.metadata.name} 创建成功`);
  backToDeployment();
};

const cancelCreate = () => {
  backToDeployment();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.configmapForm.metadata.name = data.cloud.name;
  data.path = proxy.$route.fullPath;
  getConfigMap();
  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.configmapForm.metadata.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

const getConfigMap = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cloud.cluster}/api/v1/namespaces/${data.cloud.namespace}/configmaps/${data.cloud.name}`,
    data: '',
    // data: data.pageInfo,
  });
  data.configmapForm.metadata = res.metadata;
  data.tableData = Object.entries(res.data).map(([key, value]) => ({ key, value }));
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

const addLabel = () => {
  data.deploymentLabels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.deploymentLabels.splice(index, 1);
};

const addContainer = () => {
  data.configmapForm.spec.template.spec.containers.push({
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
  });
};

const deleteContainer = (index) => {
  data.configmapForm.spec.template.spec.containers.splice(index, 1);
};

// 回到 configmap 页面
const backToConfigmap = () => {
  proxy.$router.push({
    name: 'configmap',
    query: data.cloud,
  });
};

const deleteRow = (index) => {
  tableData.value.splice(index, 1);
};

const onAddItem = () => {
  tableData.value.push({
    key: 'Tom',
    value: 'California',
  });
};
</script>

<style>
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.configmap-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}

.app-pixiu-line-describe2 {
  margin-left: 2px;
  font-size: 12px;
  color: #888888;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.deploy-pixiu-column {
  font-size: 13px;
  color: #606266;
}

.deploy-pixiu-incard {
  /* width: 323px; */
  width: 53%;
}

.container-line-describe {
  margin-left: 90px;
  font-size: 12px;
  color: #888888;
}

.configmap-class .el-radio {
  background-color: white;
  border-radius: 0;
  margin-right: 0;
  width: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.configmap-class .el-radio.is-bordered.is-checked {
  border-color: blue; /* 颜色待定 */
}

.configmap-class .el-radio__input.is-checked + .el-radio__label {
  color: blue; /* 颜色待定 */
}

.configmap-class .el-radio__label {
  font-size: 13px;
}

.configmap-class .el-radio__inner {
  display: none;
}

.el-descriptions__cell {
  width: 30%;
  display: inline-flex;
  border: none !important;
}
.el-descriptions__content {
  flex: 1;
  border: none !important;
  background: white;
}
.mt-4 {
  border: none;
  color: rgb(64, 64, 237);
}
</style>
