<template>
  <pixiu-icon
    v-if="icon"
    :color="type === 'danger' ? '#f56c6c' : '#67c23a'"
    :size="size"
    name="{{type === 'danger'? 'CircleCloseFilled' :'SuccessFilled'}}"
  />

  <em
    v-if="type === 'danger' && !icon"
    :style="`width:${size}px;height: ${size}px;`"
    class="status-circle-danger"
  ></em>
  <em
    v-if="!icon && type !== 'danger'"
    :style="`width:${size}px;height: ${size}px;`"
    class="status-circle-success"
  ></em>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'success',
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
