<template>
  <div
    :style="`
      width: 100%;
      height: ${props.height};
      background: #ffffff;
      display: flex;
      align-items: center;
    `"
  >
    <div class="app-pixiu-header-title">
      {{ props.title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "默认标题",
  },
  height: {
    type: String,
    default: "60px",
  },
});
</script>

<style scoped>
.app-pixiu-header-title {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  font-weight: 700;
  padding-left: 20px;
}
</style>
