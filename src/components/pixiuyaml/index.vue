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
    使用指南
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
    v-model:visible="data.dialogVisible"
    :fullscreen="data.isFullscreen"
    :model-value="data.yamlDialog"
    style="color: #000000; font: 14px; margin-top: 50px"
    :width="data.dialogWidth + 'px'"
    center
    @close="closeYamlDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">{{ data.title }}</div>
    </template>
    <div style="margin-top: -18px"></div>
    <el-radio-group v-model="data.fromSize" style="margin-top: 4px">
      <el-radio-button label="small">小窗</el-radio-button>
      <el-radio-button label="middle">中等</el-radio-button>
      <el-radio-button label="large">全屏</el-radio-button>
    </el-radio-group>
    <MyMonaco ref="editYaml" :yaml="data.yaml" :height="data.dialogHeight"></MyMonaco>

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
import MyMonaco from '@/components/monaco/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  cluster: '',
  yamlDialog: false,
  yaml: '',
  fromSize: 'small',
  dialogWidth: 300,
  dialogHeight: 450,
  dialogVisible: false, // 控制对话框显示与隐藏的变量
  isFullscreen: false, // 控制对话框是否全屏的变量
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
  refresh: {
    type: Function,
    default: () => {},
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
});

watch(() => {
  if (data.fromSize === 'small') {
    data.dialogWidth = 900;
    data.dialogHeight = 450;
    data.isFullscreen = false;
  } else if (data.fromSize === 'middle') {
    data.dialogWidth = 1200;
    data.dialogHeight = 560;
    data.isFullscreen = false;
  } else {
    data.dialogHeight = 800;
    data.isFullscreen = !data.isFullscreen; // 切换全屏状态
  }
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
  const baseUrl = `/pixiu/proxy/${data.cluster}`;
  const APIPaths = ['/apis', '/api'];

  let found = false;
  let wantedAPIPath = '';
  let wantedResource = {};
  // 查找 k8s API，获取任意资源
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
      message: `${kind}: ${name}(${apiVersion}) 已存在`,
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

      proxy.$message.success(`${kind}: ${name}(${apiVersion}) 创建成功`);
      data.yamlDialog = false;
      data.yaml = '';
      props.refresh();
    } catch (error) {
      proxy.$message.error(error.response.data.message);
    }
  }
};
</script>
<style>
/* 根据 isFullscreen 的状态来设置对话框的大小 */
.el-dialog__wrapper.is-fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
}
</style>
