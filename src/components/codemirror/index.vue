<template>
  <Codemirror
    v-model:value="code"
    :options="data.cmOptions"
    border
    placeholder=""
    :height="720"
    @change="change"
  />
</template>

<script setup lang="jsx">
import Codemirror from 'codemirror-editor-vue3';

// placeholder
import 'codemirror/addon/display/placeholder.js';
// language
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js';
// placeholder
import 'codemirror/addon/display/placeholder.js';
// theme
import 'codemirror/theme/dracula.css';

import { ref, reactive, onMounted, watch, defineExpose } from 'vue';
const code = ref(null);
const data = reactive({
  cmOptions: {
    mode: 'yaml', // Language mode
    theme: 'dracula', // Theme
    readOnly: false,
  },
});
const props = defineProps({
  yaml: {
    type: String,
    default: '张三',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
onMounted(() => {
  code.value = props.yaml.valueOf();
  // data.cmOptions.readOnly = props.readOnly.valueOf();
});

watch(() => {
  code.value = props.yaml.valueOf();
  // data.yaml = props.yaml.valueOf();
});

const change = () => {
  // this.props.yaml = code.value;
};
defineExpose({ code });
</script>
