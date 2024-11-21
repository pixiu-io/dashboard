<template>
  <el-dialog
    v-model:visible="data.dialogVisible"
    :fullscreen="data.isFullscreen"
    :model-value="yamlDialog.valueOf()"
    :style="{ color: '#000000', font: '14px', marginTop: data.marginTop }"
    :width="data.dialogWidth + 'px'"
    center
    @close="closeYamlDialog"
  >
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          text-align: left;
          font-weight: bold;
          padding-left: 15px;
        "
      >
        <span> {{ data.title }}</span>
        <span style="display: flex; align-items: center">
          <!-- <pixiu-icon
            name="icon-zuixiaohua-01"
            size="15px"
            type="iconfont"
            style="vertical-align: middle; padding-right: 10px; cursor: pointer"
            color="#909399"
            @click="exitFullScreen"
          />
          <pixiu-icon
            name="icon-quanpingzuidahua"
            size="15px"
            type="iconfont"
            style="vertical-align: middle; margin-right: 10px; cursor: pointer"
            color="#909399"
            @click="fullScreen"
          /> -->
        </span>
      </div>
    </template>
    <!--    <div class="custom-radio-group">-->
    <!--      <el-radio-group v-model="state.fromSize" style="margin-top: 4px">-->
    <!--        <el-radio-button label="small">小窗</el-radio-button>-->
    <!--        <el-radio-button label="middle">中等</el-radio-button>-->
    <!--        <el-radio-button label="large">全屏</el-radio-button>-->
    <!--      </el-radio-group>-->
    <!--    </div>-->
    <div style="margin-left: 15px; margin-right: 15px; margin-top: -1px">
      <MyMonaco
        ref="editYaml"
        :yaml="data.yaml"
        :height="data.dialogHeight"
        :read-only="readOnly"
      ></MyMonaco>
    </div>

    <div style="margin-top: 10px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeYamlDialog">关闭</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmYaml"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import MyMonaco from '@/components/monaco/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch, toRaw } from 'vue';
import jsYaml from 'js-yaml';
import { ElMessage } from 'element-plus';
import PixiuIcon from '@/components/pixiuIcon/index.vue';
const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  title: '',
  cluster: '',
  yaml: '',
  fromSize: 'middle',
  dialogWidth: 900,
  dialogHeight: 450,
  marginTop: '50px',
  dialogVisible: false, // 控制对话框显示与隐藏的变量
  isFullscreen: false, // 控制对话框是否全屏的变量
});

const props = defineProps({
  cluster: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '查看Yaml',
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
  yamlDialog: {
    type: Boolean,
    default: false,
  },
  yaml: {
    type: String,
    default: '',
  },
  refresh: {
    type: Function,
    default: () => {},
  },
  confirm: {
    type: Function,
    default: () => {},
  },
});

const yamlDialog = ref(props.yamlDialog);

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
});

watch(() => {
  data.yaml = jsYaml.dump(props.yaml.valueOf(), { quotingType: '"' });
  yamlDialog.value = props.yamlDialog.valueOf();
  data.title = props.title.valueOf();

  /**
   * 窗体大小变更
   */
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

const closeYamlDialog = () => {
  yamlDialog.value = false;
  data.yaml = '';
};

/**
 * 判空处理
 * @param name
 * @param value
 * @returns {boolean}
 */
const checkEmpty = (name, value) => {
  if (value === undefined || value === '' || value === null) {
    ElMessage.warning(`${name} 为必填项`);
    return true;
  }
  return false;
};

const confirmYaml = () => {
  if (data.title === '编辑Yaml') {
    updateYaml();
  }
  yamlDialog.value = false;
};

const fullScreen = () => {
  data.fromSize = 'large';
};
const exitFullScreen = () => {
  data.fromSize = 'small';
};

/**
 * 更新 yaml
 * @returns {Promise<void>}
 */
const updateYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  if (yamlData === undefined) {
    ElMessage({
      message: 'YAML更新不能为空',
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
      method: 'put',
      url: `${url}/${name}`,
      data: yamlData,
    });

    proxy.$message.success(`${kind}: ${name}(${apiVersion}) 更新成功`);
    yamlDialog.value = false;
    data.yaml = '';
    props.refresh();
  } catch (error) {
    proxy.$message.error(error.response.data.message);
  }
};
</script>

<style>
/* 根据 isFullscreen 的状态来设置对话框的大小 */
.el-dialog__wrapper.is-fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  top: 0 !important;
  margin-top: 0 !important;
  left: 0 !important;
}

/* 将第一个和最后一个元素的圆角变成0 */
.custom-radio-group .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}
.custom-radio-group .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0;
}
</style>
