<template>
  <Codemirror
    v-model:value="data.code"
    :options="data.cmOptions"
    border
    placeholder=""
    :height="200"
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

import { ref, reactive, onMounted } from 'vue';
const code = ref(null);
const data = reactive({
  code: '',
  cmOptions: {
    mode: 'yaml', // Language mode
    theme: 'dracula', // Theme
  },
});
const props = defineProps({
  yaml: {
    type: String,
    default: '张三',
  },
});
onMounted(() => {
  console.log(props);
  data.code = props.yaml.valueOf();
});
const change = () => {
  console.log(data.code);
};
</script>
