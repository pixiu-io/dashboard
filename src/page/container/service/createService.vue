<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Service</div>
  </el-card>

  <el-main>
    <el-card class="create-card-style">
      <el-form label-position="left" label-width="100px" style="margin-left: 3%; width: 80%">
        <div style="margin-top: 20px" />
        <el-form-item label="名称" style="width: 500px">
          <el-input v-model="data.form.metadata.name" />
          <div class="app-pixiu-line-describe2">
            最长63个字符，只能包含小写字母、数字及分隔符("-")
          </div>
        </el-form-item>

        <el-form-item label="命名空间" style="width: 300px">
          <div class="namespace-select-container">
            <el-select v-model="data.form.metadata.namespace" @change="changeNamespace">
              <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="类型" style="width: 500px">
          <el-input v-model="data.form.metadata.name" />
          <div class="app-pixiu-line-describe2">
            最长63个字符，只能包含小写字母、数字及分隔符("-")
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </el-main>
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

  labels: [],

  // deployment 创建初始对象
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
  },
});

const handleChange = (value) => {
  data.deploymentForm.spec.replicas = value;
};

const comfirmCreate = async () => {
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/app'] = data.deploymentForm.metadata.name;
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
  data.deploymentForm.spec.template.metadata.labels = data.deploymentForm.spec.selector.matchLabels;

  for (let i = 0; i < data.deploymentLabels.length; i++) {
    data.deploymentForm.spec.template.metadata.labels[data.deploymentLabels[i].key] =
      data.deploymentLabels[i].value;
  }

  try {
    const resp = await proxy.$http({
      method: 'post',
      url:
        `/proxy/pixiu/${data.cloud.cluster}/apis/apps/v1/namespaces/` +
        data.deploymentForm.metadata.namespace +
        `/deployments`,
      data: data.deploymentForm,
    });
  } catch (error) {}

  proxy.$message.success(`deployment ${data.deploymentForm.metadata.name} 创建成功`);
  backToDeployment();
};

const cancelCreate = () => {
  backToDeployment();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.deploymentForm.metadata.namespace = val;
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

const addLabel = () => {
  data.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.labels.splice(index, 1);
};

const backToService = () => {
  proxy.$router.push({
    name: 'Service',
    query: data.cloud,
  });
};
</script>

<style></style>
