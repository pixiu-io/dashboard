<template>
  <div
    style="
      display: block;
      font-size: 12px;
      margin-top: -20px;
      float: right;
      color: rgba(0, 0, 0, 0.9);
    "
  >
    操作指南
    <el-icon style="vertical-align: middle; margin-right: 10px">
      <component :is="'Edit'" />
    </el-icon>
    <button
      class="pixiu-two-button"
      style="width: 120px; margin-top: -10px"
      @click="handleCreateYamlDialog"
    >
      YAML创建资源
    </button>
  </div>

  <el-dialog
    :model-value="data.yamlDialog"
    style="color: #000000; font: 14px; margin-top: 50px"
    width="50%"
    center
    @close="closeYamlDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">{{ data.title }}</div>
    </template>
    <div style="margin-top: -18px"></div>
    <MyCodeMirror ref="editYaml" :yaml="data.yaml" :height="560"></MyCodeMirror>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeYamlDialog">取消</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmYaml"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  cluster: '',

  yamlDialog: false,
  yaml: '',
  yamlCreateUrl: '',
});

const props = defineProps({
  cluster: {
    type: String,
    default: '',
  },
  yamlCreateUrl: {
    type: String,
    default: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
});

watch(() => {
  // data.cluster = props.cluster.valueOf();
  data.yamlCreateUrl = props.yamlCreateUrl.valueOf();
});

const handleCreateYamlDialog = () => {
  data.yaml = jsYaml.dump();
  data.yamlDialog = true;
};

const closeYamlDialog = () => {
  data.yamlDialog = false;
  data.yaml = '';
};

const confirmYaml = async () => {
  const d = jsYaml.load(editYaml.value.code);
  if (d === undefined) {
    ElMessage({
      message: 'YAML创建资源不能为空',
      type: 'warning',
    });
    return;
  }

  // try {
  //   const resp = await proxy.$http({
  //     method: data.yamlMethod,
  //     url: data.yamlCreateUrl,
  //     data: yaml,
  //   });
  // } catch (error) {}
  // data.yamlDialog = false;
  // data.yaml = '';
  // proxy.$message.success(`创建成功`);
};
</script>
