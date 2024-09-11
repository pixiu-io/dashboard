<template>
  <div>
    <el-form ref="startRef" :model="state" require-asterisk-position="right" status-icon>
      <el-form-item label-width="100px" style="margin-bottom: 0" inline>
        <template #label>
          <div style="align-items: center">
            <el-tooltip
              class="box-item"
              effect="light"
              content="自定义容器启动时运行的命令; 默认情况下，容器启动时将运行镜像默认命令"
              placement="top-start"
              raw-content
            >
              启动命令
            </el-tooltip>
          </div>
        </template>
        <el-checkbox v-model="state.set" label="开启" size="small" />
        <el-button
          v-if="state.show"
          v-show="state.set"
          type="info"
          text
          icon="CaretTop"
          size="small"
          style="margin-left: 30px"
          @click="state.show = !state.show"
          >隐藏</el-button
        >
        <el-button
          v-else
          v-show="state.set"
          type="info"
          text
          icon="CaretBottom"
          size="small"
          style="margin-left: 30px"
          @click="state.show = !state.show"
          >展开</el-button
        >
      </el-form-item>
      <el-form-item label-width="100px">
        <el-form-item
          v-show="state.set && state.show"
          label="命令："
          label-width="80px"
          class="nested-item"
          prop="commands"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="state.commands" size="small" style="width: 300px" type="textarea" />
          <div style="font-size: 13px; color: rgba(22, 9, 7, 0.57); margin-left: 5px">
            如有多个命令请使用半角逗号（,）分隔
          </div>
        </el-form-item>
        <el-form-item
          v-show="state.set && state.show"
          label="参数："
          label-width="80px"
          class="nested-item"
        >
          <el-input v-model="state.args" size="small" style="width: 300px" type="textarea" />
          <span style="font-size: 13px; color: rgba(22, 9, 7, 0.57); margin-left: 5px">
            如有多个参数请使用半角逗号（,）分隔</span
          >
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const startRef = ref();

const state = reactive({
  verified: false,
  set: false,
  show: true,
  commands: '',
  args: '',
  k8s: {
    commands: [],
    args: [],
  },
});

const props = defineProps({
  args: {
    type: Array,
    default: () => [],
  },
  commands: {
    type: Array,
    default: () => [],
  },
});

const handleArr = (source) => {
  const dataCopy = JSON.parse(JSON.stringify(source));
  let str = '';
  dataCopy.forEach((item, index) => {
    if (index === dataCopy.length - 1) {
      str = str + item;
    } else {
      str = str + item + ',';
    }
  });
  return str;
};
onMounted(() => {
  if (props.args.length > 0) {
    state.set = true; //当本地数据为空，但是传递过来数据不为空时则显示
    state.args = handleArr(props.args);
  }
  if (props.commands.length > 0) {
    state.set = true; //当本地数据为空，但是传递过来数据不为空时则显示
    state.commands = handleArr(props.commands);
  }
});

const getStartCommand = async () => {
  state.verified = true;
  if (state.set) {
    await startRef.value.validate((valid) => {
      if (state.verified && !valid) {
        state.verified = false;
      }
    });
  }
  if (!state.set) {
    state.k8s.args = [];
    state.k8s.commands = [];
  } else {
    if (state.args.length > 0) {
      state.k8s.args = state.args.split(',');
    }
    if (state.commands.length > 0) {
      state.k8s.commands = state.commands.split(',');
    }
  }
  return {
    set: state.set,
    commands: state.k8s.commands,
    args: state.k8s.args,
    verified: state.verified,
  };
};

defineExpose({
  getStartCommand,
});
</script>

<style scoped>
.nested-item {
  margin-bottom: 10px;
  margin-top: 9px;
}
</style>
