<template>
  <el-card style="border-radius: 0; height: 100%; position: relative">
    <div
      style="
        background-color: #29232b;
        color: white;
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
      "
    >
      <div
        ref="parentRef"
        style="margin-left: 20px; position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px"
      >
        <MyMonaco :yaml="data.log" :height="dialogHeight" :read-only="readOnly"></MyMonaco>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import MyMonaco from '@/components/monaco/index.vue';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
  toRaw,
  computed,
  watchEffect,
  onUnmounted,
} from 'vue';

const parentRef = ref(null);
const { proxy } = getCurrentInstance();

const data = reactive({
  cluster: '',
  log: '',
  fromSize: 'small',
  //   dialogWidth: 300,
  // dialogHeight: 500,
});

// dialogHeight 是一个响应式变量，用于保存 dialog 的高度
const dialogHeight = ref(400);

// 监听 parentRef 的 clientHeight 的变化
watchEffect(() => {
  if (parentRef.value) {
    // 获取父元素的 clientHeight
    const parentClientHeight = parentRef.value.clientHeight;
    // 更新 dialogHeight
    dialogHeight.value = parentClientHeight;
  }
});

const props = defineProps({
  cluster: {
    type: String,
    default: '',
  },
  log: {
    type: String,
    default: '',
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  window.addEventListener('resize', resizeHandler);
});

// 监听窗口的 resize 事件，以在窗口大小改变时重新计算 dialogHeight
const resizeHandler = () => {
  // 这里不需要执行任何操作，只需作为 resize 事件的回调函数即可
  if (parentRef.value) {
    // 获取父元素的 clientHeight
    const parentClientHeight = parentRef.value.clientHeight;
    // 更新 dialogHeight
    dialogHeight.value = parentClientHeight;
  }
};

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});

watch(() => {
  data.log = props.log.valueOf();
});
</script>

<style></style>
