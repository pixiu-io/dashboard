<template>
  <div class="index">
    <slot> </slot>
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="desc"
      placement="top"
      :raw-content="rawContent"
    >
      <pixiu-icon :name="icon" size="16px" type="el" class-name="icon-box" color="#909399" />
    </el-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  rawContent: {
    type: Boolean,
    default: false,
  },
  desc: { type: String, default: '' },
});
</script>

<style scoped>
.index {
  display: flex;
}
.icon-box {
  padding: 4px;
  margin-top: -1px;
}
</style>
