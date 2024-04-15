<template>
  <el-dialog
    v-model:visible="data.dialogVisible"
    :fullscreen="data.isFullscreen"
    :model-value="yamlDialog.valueOf()"
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
    <MyCodeMirror
      ref="editYaml"
      :yaml="data.yaml"
      :height="data.dialogHeight"
      :read-only="readOnly"
    ></MyCodeMirror>

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
import MyCodeMirror from '@/components/codemirror/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import jsYaml from 'js-yaml';
const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  title: '',
  cluster: '',
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
  data.yaml = jsYaml.dump(props.yaml.valueOf());
  yamlDialog.value = props.yamlDialog.valueOf();
  data.title = props.title.valueOf();

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

const confirmYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  props.confirm(yamlData);
  yamlDialog.value = false;
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
