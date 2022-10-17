<template>
  <el-icon :size="props.fontSize" :color="props.color">
    <component :is="iconName" v-if="props.iconType === 'el'" />
    <svg
      v-if="props.iconType === 'iconfont'"
      :width="props.fontSize"
      :height="props.fontSize"
      aria-hidden="true"
    >
      <use
        :xlink:href="iconClassName"
        :width="props.fontSize"
        :height="props.fontSize"
        fill="currentColor"
      />
    </svg>
  </el-icon>
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
    default: "#ffffff",
  },
  fontSize: {
    type: String,
    default: "16px",
  },
  iconType: {
    type: String,
    default: "el",
  },
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
});
</script>

<style scoped></style>
