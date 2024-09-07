<template>
  <el-dialog
    v-model="data.dialogVisible"
    :fullscreen="data.isFullscreen"
    :style="{ color: '#000000', font: '14px', marginTop: data.marginTop }"
    :width="data.dialogWidth + 'px'"
    center
    @close="close"
  >
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          font-weight: bold;
          padding-left: 15px;
          padding-right: 15px;
        "
      >
        <span> {{ title }}</span>
        <span style="display: flex; align-items: center"> </span>
      </div>
    </template>
    <MyMonaco
      ref="editYaml"
      :yaml="data.yaml"
      :height="data.dialogHeight"
      :read-only="readOnly"
    ></MyMonaco>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" size="small" @click="close">关闭</el-button>
        <el-button
          type="primary"
          class="pixiu-small-confirm-button"
          size="small"
          @click="confirmYaml"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import MyMonaco from '@/components/monaco/index.vue';
import { reactive, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { ElMessage } from 'element-plus';

const editYaml = ref();
const data = reactive({
  yaml: '',
  fromSize: 'small',
  dialogWidth: 900,
  dialogHeight: 450,
  marginTop: '50px',
  dialogVisible: false, // 控制对话框显示与隐藏的变量
  isFullscreen: false, // 控制对话框是否全屏的变量
});

const emit = defineEmits(['refresh', 'confirm', 'update:visible']);

const props = defineProps({
  title: {
    type: String,
    default: '查看Yaml',
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  yaml: {
    type: Object,
    default: () => {},
  },
});

onMounted(() => {
  data.yaml = jsYaml.dump(props.yaml.valueOf(), { quotingType: '"' });
  data.dialogVisible = props.visible;
});

const close = () => {
  emit('update:visible', false);
  data.yaml = '';
};

const confirmYaml = () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  if (yamlData === undefined) {
    ElMessage({
      message: 'YAML更新不能为空',
      type: 'warning',
    });
    return;
  }
  emit('confirm', yamlData);
  close();
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
