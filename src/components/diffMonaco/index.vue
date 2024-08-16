<template>
  <div>
    <div
      ref="editorContainer"
      :style="{
        width: data.width,
        height: data.height,
      }"
    ></div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor';
import { toRaw, onMounted, ref, reactive, watch } from 'vue';
const monacoEditor = ref(undefined);
const editorContainer = ref(null);
const data = reactive({
  original: {},
  modified: {},
  width: '100%',
  height: '100%',
});

const props = defineProps({
  original: {
    type: Object,
    default: () => ({}),
  },
  modified: {
    type: Object,
    default: () => ({}),
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 450,
  },
  type: {
    type: String,
    default: 'yaml',
  },
});

onMounted(() => {
  init();
});

/**
 * 判断是否为数字类型
 * @param value
 * @returns {boolean}
 */
const isNumber = (value) => {
  let numReg = /^[0-9]*$/;

  let numRe = new RegExp(numReg);
  if (numRe.test(value)) {
    return true;
  }

  return false;
};

const init = () => {
  data.original = props.original.valueOf();
  data.modified = props.modified.valueOf();
  data.readOnly = props.readOnly.valueOf();
  data.height = isNumber(props.height.valueOf())
    ? props.height.valueOf() + 'px'
    : props.height.valueOf();

  // 使用 - 创建 monacoEditor 对象
  monacoEditor.value = monaco.editor.createDiffEditor(editorContainer.value, {
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
  toRaw(monacoEditor.value).setModel({
    original: monaco.editor.createModel(data.original, 'yaml'),
    modified: monaco.editor.createModel(data.modified, 'yaml'),
  });
};
</script>
