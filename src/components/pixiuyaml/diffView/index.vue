<template>
  <el-dialog
    v-model="data.dialogVisible"
    :fullscreen="data.isFullscreen"
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
          align-items: center;
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
        "
      >
        <span> {{ title }}</span>
        <span style="display: flex; align-items: center"> </span>
      </div>
    </template>
    <div>
      <el-row :gutter="24" style="margin-bottom: 10px">
        <el-col :span="12"><span> 当前版本:</span></el-col>
        <el-col :span="12"><span> 历史版本:</span></el-col>
      </el-row>
      <MyMonaco
        ref="editYaml"
        :original="data.original"
        :modified="data.modified"
        :read-only="readOnly"
      ></MyMonaco>
    </div>
  </el-dialog>
</template>

<script setup lang="jsx">
import MyMonaco from '@/components/diffMonaco/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch, toRaw } from 'vue';
import jsYaml from 'js-yaml';
import { ElMessage } from 'element-plus';
import PixiuIcon from '@/components/pixiuIcon/index.vue';
const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  original: '',
  modified: '',
  fromSize: 'small',
  dialogWidth: 1100,
  dialogHeight: 650,
  marginTop: '50px',
  dialogVisible: false, // 控制对话框显示与隐藏的变量
  isFullscreen: false, // 控制对话框是否全屏的变量
});

const props = defineProps({
  title: {
    type: String,
    default: '查看Yaml',
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  original: {
    type: Object,
    default: () => ({}),
  },
  modified: {
    type: Object,
    default: () => ({}),
  },
});

onMounted(() => {
  data.original = jsYaml.dump(props.original.valueOf(), { quotingType: '"' });
  data.modified = jsYaml.dump(props.modified.valueOf(), { quotingType: '"' });
  data.dialogVisible = props.dialogVisible.valueOf();
});

const emit = defineEmits(['update', 'update:dialogVisible']);
const closeYamlDialog = () => {
  emit('update:dialogVisible', false);
  data.original = '';
  data.modified = '';
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
