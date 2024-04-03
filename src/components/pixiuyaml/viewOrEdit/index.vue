<template>
  <el-dialog
    :model-value="yamlDialog.valueOf()"
    style="color: #000000; font: 14px; margin-top: 50px"
    :width="data.dialogWidth + 'px'"
    center
    @close="closeYamlDialog"
    @wheel="handleScroll"
    @scroll.self="handleScroll"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">{{ data.title }}</div>
    </template>
    <div style="margin-top: -18px"></div>
    <MyCodeMirror
      ref="editYaml"
      :yaml="data.yaml"
      :height="560"
      :read-only="readOnly"
    ></MyCodeMirror>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeYamlDialog">关闭</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirm"
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
  dialogWidth: 900,
});

const props = defineProps({
  cluster: {
    type: String,
    default: '',
  },
  // viewOrEditDailog: {
  //   type: Object,
  //   default: () => ({
  //     title:
  //   }),
  // },

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
});

const handleScroll = (event) => {
  if (event.deltaY < 0 && data.dialogWidth < 1500) {
    data.dialogWidth += 10;
  } else {
    if (data.dialogWidth > 900) {
      data.dialogWidth -= 10;
    }
  }
};

const closeYamlDialog = () => {
  yamlDialog.value = false;
  data.yaml = '';
};

const confirmYaml = async () => {
  yamlDialog.value = false;
};
</script>
