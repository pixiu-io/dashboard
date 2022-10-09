<template>
  <el-icon
    v-if="props.icon"
    :color="props.type === 'danger' ? '#f56c6c' : '#67c23a'"
    :size="props.size"
  >
    <component
      v-if="props.type === 'danger'"
      is="CircleCloseFilled"
    ></component>
    <component v-else is="SuccessFilled"></component>
  </el-icon>

  <em
    v-if="props.type === 'danger' && !props.icon"
    :style="`width:${props.size}px;height: ${props.size}px;`"
    class="status-circle-danger"
  ></em>
  <em
    v-if="!props.icon && props.type !== 'danger'"
    :style="`width:${props.size}px;height: ${props.size}px;`"
    class="status-circle-success"
  ></em>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "success",
  },
  size: {
    type: Number,
    default: 20,
  },
  icon: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.status-circle-danger {
  background-color: #f56c6c;
  border-radius: 50%;
}
.status-circle-success {
  background-color: #67c23a;
  border-radius: 50%;
}
</style>
