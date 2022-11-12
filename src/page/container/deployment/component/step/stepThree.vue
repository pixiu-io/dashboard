<template>
  <div>镜像拉取策略 主机网络 重启策略 DNS策略</div>
  <div style="display: flex; justify-content: center">
    <el-space size="{8}">
      <div>
        <el-button @click="pre">上一步</el-button>
      </div>
      <div>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-space>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
const advancedData = reactive({
  hostNetwork: true,
});

// 定义取消、下一步的emit，通过父组件调用
const emit = defineEmits(['next', 'pre']);
const pre = () => emit('pre');
const onSubmit = () => {
  emit('next', advancedData);
};
</script>
<style scoped></style>
