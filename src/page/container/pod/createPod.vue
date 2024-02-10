<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="backToPod"
          ><span style="color: black; cursor: pointer"> Cluster: {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span style="color: black"> Namespace: {{ data.namespace }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> Pods </span> </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> 创建Pod </span> </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  cluster: '',
  clusterName: '',
  namespace: 'default',

  namespaces: [],

  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },

    spec: {},
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Service 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  getNamespaces();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const cancel = () => {
  backToService();
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const backToPod = () => {
  proxy.$router.push({
    name: 'Pod',
    query: data.query,
  });
};
</script>

<style></style>
