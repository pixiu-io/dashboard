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
  const yamlData = jsYaml.load(editYaml.value.code);
  if (yamlData === undefined) {
    ElMessage({
      message: 'YAML创建资源不能为空',
      type: 'warning',
    });
    return;
  }

  // TODO: 待优化
  const kind = yamlData.kind;
  if (kind === undefined || kind === '' || kind === null) {
    ElMessage({
      message: 'kind 为必填项',
      type: 'warning',
    });
    return;
  }

  const metadata = yamlData.metadata;
  if (metadata === undefined || metadata === '' || metadata === null) {
    ElMessage({
      message: 'metadata 为必填项',
      type: 'warning',
    });
    return;
  }
  const name = metadata.name;
  if (name === undefined || name === '' || name === null) {
    ElMessage({
      message: 'metadata.name 为必填项',
      type: 'warning',
    });
    return;
  }
  const namespace = metadata.namespace;
  if (namespace === undefined || namespace === '' || namespace === null) {
    ElMessage({
      message: 'metadata.namespace 为必填项',
      type: 'warning',
    });
    return;
  }

  let baseUrl = `/proxy/pixiu/${data.cluster}`;
  if (kind === 'Secret') {
    baseUrl = baseUrl + `/api/v1/namespaces/${namespace}/secrets`;
  } else if (kind === 'Service') {
    baseUrl = baseUrl + `/api/v1/namespaces/${namespace}/services`;
  } else if (kind === 'ConfigMap') {
    baseUrl = baseUrl + `/api/v1/namespaces/${namespace}/configmaps`;
  } else if (kind === 'Deployment') {
    baseUrl = baseUrl + `/apis/apps/v1/namespaces/${namespace}/deployments`;
  } else {
    ElMessage({
      message: '资源类型 ' + kind + ' 暂不支持',
      type: 'warning',
    });
    return;
  }

  try {
    const resp = await proxy.$http({
      method: 'get',
      url: `${baseUrl}/${name}`,
    });
    ElMessage({
      message: `${kind}: ${name}(${namespace}) 已存在`,
      type: 'warning',
    });
    return;
  } catch (error) {
    if (error.response.status !== 404) {
      ElMessage({
        message: error.response.data.message,
        type: 'error',
      });
      return;
    }

    //  对象不存在时，下发创建请求
    try {
      const resp = await proxy.$http({
        method: 'post',
        url: baseUrl,
        data: yamlData,
      });

      proxy.$message.success(`${kind}: ${name}(${namespace}) 创建成功`);
      data.yamlDialog = false;
      data.yaml = '';
    } catch (error) {
      proxy.$message.error(error.response.data.message);
    }
  }
};
</script>
