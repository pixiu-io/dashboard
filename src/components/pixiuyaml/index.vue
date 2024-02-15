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
    操作指导
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
  editYaml.value.code = '';
};

const checkEmpty = (name, value) => {
  if (value === undefined || value === '' || value === null) {
    ElMessage.warning(`${name} 为必填项`);
    return true;
  }
  return false;
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

  const kind = yamlData.kind;
  const apiVersion = yamlData.apiVersion;
  if (
    checkEmpty('kind', kind) ||
    checkEmpty('apiVersion', apiVersion) ||
    checkEmpty('metadata', yamlData.metadata) ||
    checkEmpty('metadata.name', yamlData.metadata.name)
  ) {
    return;
  }
  const metadata = yamlData.metadata;
  const name = metadata.name;
  const baseUrl = `/proxy/pixiu/${data.cluster}`;
  const APIPaths = ['/apis', '/api'];

  let found = false;
  let wantedAPIPath = '';
  let wantedResource = {};
  // 遍历k8s API，获取任意资源
  for (let APIPath of APIPaths) {
    try {
      const resp = await proxy.$http({
        method: 'get',
        url: `${baseUrl}${APIPath}/${apiVersion}?timeout=30s`,
      });
      for (let resource of resp.resources) {
        if (resource.kind === kind) {
          found = true;
          wantedAPIPath = APIPath;
          wantedResource = resource;
          break;
        }
      }
    } catch (error) {
      continue;
    }
    if (found) {
      break;
    }
  }
  if (!found) {
    ElMessage({
      message: 'kind: ' + kind + 'apiVersion: ' + apiVersion + ' 暂不支持',
      type: 'warning',
    });
    return;
  }

  // 构造 k8s url
  let url = `${baseUrl}${wantedAPIPath}/${apiVersion}`;
  // 如果是命名空间级别的资源，则追加 namespaces
  if (wantedResource.namespaced) {
    const namespace = metadata.namespace;
    if (checkEmpty('metadata.namespace', namespace)) {
      return;
    }
    url = url + `/namespaces/${namespace}`;
  }
  // 追加k8s资源
  url = url + `/${wantedResource.name}`;

  try {
    const resp = await proxy.$http({
      method: 'get',
      url: `${url}/${name}`,
    });
    ElMessage({
      message: `apiVersion: ${apiVersion} kind: ${kind} name: ${name} 已存在`,
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
        url: url,
        data: yamlData,
      });

      proxy.$message.success(`apiVersion: ${apiVersion} kind: ${kind} name: ${name} 创建成功`);
      data.yamlDialog = false;
      data.yaml = '';
    } catch (error) {
      proxy.$message.error(error.response.data.message);
    }
  }
};
</script>
