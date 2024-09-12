<template>
  <el-form
    ref="metaRef"
    label-position="left"
    require-asterisk-position="right"
    label-width="100px"
    :rules="rules"
    status-icon
    :model="state.metadata"
    style="margin-left: 3%; width: 70%"
  >
    <div style="margin-top: 20px" />
    <el-form-item label="名称" prop="name" style="width: 400px">
      <el-input v-model="state.metadata.name" />
      <div class="app-pixiu-line-describe2">最长63个字符，只能包含小写字母、数字及分隔符("-")</div>
    </el-form-item>

    <el-form-item label="命名空间" style="width: 400px">
      <div class="namespace-select-container">
        <el-select v-model="state.metadata.namespace">
          <el-option v-for="item in state.namespaces" :key="item" :value="item" :label="item" />
        </el-select>
      </div>
    </el-form-item>
    <Labels ref="labelRef" :labels="state.metadata.labels" :name="'标签'" />
    <Labels ref="annotationRef" :labels="state.metadata.annotations" :name="'注解'" />
    <el-form-item label="实例数量" style="margin-top: 20px">
      <el-input-number v-model="state.replicas" style="margin-top: 8px" :min="0" size="small"
    /></el-form-item>
    <div class="app-pixiu-line-describe" style="margin-top: -10px">Deployment 副本设置</div>
  </el-form>
</template>
<script setup>
import { defineAsyncComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';

const labelRef = ref();
const annotationRef = ref();
const metaRef = ref();
const Labels = defineAsyncComponent(() => import('./label.vue'));
const { proxy } = getCurrentInstance();
const state = reactive({
  metadata: {
    name: '',
    namespace: 'default',
    labels: {},
    annotations: {},
  },
  replicas: 1,
  namespaces: [],
  cluster: '',
  verified: true,
});
const props = defineProps({
  replicas: {
    type: Number,
    default: 1,
  },
  metadata: {
    type: Object,
    required: true,
  },
});
const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(state.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  state.namespaces = result;
};
const rules = {
  name: [{ required: true, message: '请输入 Deployment 名称', trigger: 'blur' }],
};

const getResult = async () => {
  state.verified = true;
  await metaRef.value.validate((valid) => {
    if (state.verified && !valid) {
      state.verified = false;
    }
  });
  await labelRef.value.labelRef.validate((valid) => {
    if (state.verified && !valid) {
      state.verified = false;
    }
  });
  await annotationRef.value.labelRef.validate((valid) => {
    if (state.verified && !valid) {
      state.verified = false;
    }
  });

  state.metadata.labels = labelRef.value.getLabels();
  state.metadata.annotations = annotationRef.value.getLabels();
  return [state.metadata, state.replicas, state.verified];
};
defineExpose({
  getResult,
});

onMounted(() => {
  state.cluster = proxy.$route.query.cluster;
  state.replicas = props.replicas;
  state.metadata = props.metadata;
  getNamespaceList();
});
</script>

<style scoped></style>
