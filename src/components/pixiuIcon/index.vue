<template>
  <el-icon :size="size" :color="color" :class="className" :style="style">
    <component :is="name" v-if="type === 'el'" />
    <svg v-if="type === 'iconfont'" :width="size" :height="size" aria-hidden="true">
      <use :xlink:href="`#${name}`" :width="size" :height="size" fill="currentColor" />
    </svg>
  </el-icon>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#cccccc',
  },
  size: {
    type: String,
    default: '16px',
  },
  type: {
    type: String,
    default: 'el',
  },
  className: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: '',
  },
});
</script>

<style scoped></style>
