<template>
  <div>
    <!--    <a-select style="width: 120px" @change="handelChange">-->
    <!--      <a-select-option v-for="(item, index) in languageList" :key="index" :value="item">-->
    <!--        {{ item }}-->
    <!--      </a-select-option>-->
    <!--    </a-select>-->
    <!--    <button @click="handleBtn">获取</button>-->
    <!--    <button @click="handleFormat">格式化</button>-->
    <!--    <button @click="handelSet">设置值</button>-->
    <div ref="editorContainer" :style="{ width: data.width, height: data.height + 'px' }"></div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor';
import { toRaw, onMounted, ref, reactive, watch } from 'vue';
const monacoEditor = ref(undefined);
const editorContainer = ref(null);
const code = ref(null);
// let languageList = ref(['javascript', 'json', 'sql', 'java', 'groovy', 'shell', 'python', 'yaml']);
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
const data = reactive({
  yaml: '',
  width: '100%',
  height: 800,
});

const props = defineProps({
  yaml: {
    type: String,
    default: '',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 600,
  },
  type: {
    type: String,
    default: 'yaml',
  },
});

onMounted(() => {
  init();
});
const handleFormat = () => {
  monacoEditor.value.getAction('editor.action.formatDocument').run();
};
const handleBtn = () => {
  let demo = toRaw(monacoEditor.value).getValue(); //获取编辑器中的文本
  console.log(demo);
};
const handelChange = (val) => {
  monaco.editor.setModelLanguage(monacoEditor.value.getModel(), val);
};
const handelSet = () => {
  toRaw(monacoEditor.value).setModel(monaco.editor.createModel(data.yaml, 'yaml'));
};

watch(() => {
  data.yaml = props.yaml.valueOf();
  data.readOnly = props.readOnly.valueOf();
  data.height = props.height.valueOf();
  if (monacoEditor.value !== undefined) {
    toRaw(monacoEditor.value).setModel(monaco.editor.createModel(data.yaml, 'yaml'));
  }
});
const init = () => {
  // 使用 - 创建 monacoEditor 对象
  monacoEditor.value = monaco.editor.create(editorContainer.value, {
    theme: 'vs-dark', // 主题
    language: props.type,
    renderLineHighlight: 'gutter',
    folding: true, // 是否折叠
    roundedSelection: false,
    foldingHighlight: true, // 折叠等高线
    foldingStrategy: 'indentation', // 折叠方式  auto | indentation
    showFoldingControls: 'always', // 是否一直显示折叠 always | mouseover
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    automaticLayout: true, // 自动布局
    codeLens: true, // 代码镜头
    scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
    colorDecorators: true, // 颜色装饰器
    accessibilitySupport: 'on', // 辅助功能支持  "auto" | "off" | "on"
    lineNumbers: 'on', // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 5, // 行号最小字符   number
    enableSplitViewResizing: false,
    readOnly: props.readOnly, //是否只读  取值 true | false
  });
  toRaw(monacoEditor.value).setModel(monaco.editor.createModel(data.yaml, 'yaml'));

  monacoEditor.value.onDidChangeModelContent(() => {
    //内容改变时给父组件实时返回值
    code.value = toRaw(monacoEditor.value).getValue();
  });
};

defineExpose({ code });
</script>
