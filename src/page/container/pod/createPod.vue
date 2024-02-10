<template>
  <el-card class="title-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToPod"
      />
      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span style="color: black"> Cluster: {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span style="color: black"> Namespace: {{ data.namespace }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> Pods </span> </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> 创建Pod </span> </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <el-card class="create-card-style">
    <el-form
      ref="ruleFormRef"
      label-position="left"
      require-asterisk-position="right"
      label-width="100px"
      :rules="rules"
      status-icon
      :model="data.form"
      style="margin-left: 3%; width: 70%"
    >
      <div style="margin-top: 20px" />
      <el-form-item label="名称" prop="metadata.name" style="width: 500px">
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

      <el-form-item label="Labels" style="margin-top: 20px">
        <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
      </el-form-item>
    </el-form>
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

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
    }
  });
};

const cancel = () => {
  backToPod();
};

const backToPod = () => {
  proxy.$router.push({
    name: 'Pod',
    query: data.query,
  });
};
</script>

<style></style>
