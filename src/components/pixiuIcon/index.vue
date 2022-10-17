<template>
  <svg :width="props.fontSize" :height="props.fontSize" aria-hidden="true">
    <use
      :xlink:href="iconClassName"
      :width="props.fontSize"
      :height="props.fontSize"
      :fill="props.color"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#cccccc",
  },
  fontSize: {
    type: String,
    default: "16px",
  },
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
});
</script>

<style scoped></style>
