<template>
  <div class="index">
    <slot> </slot>
    <el-tooltip class="box-item" effect="dark" :content="desc" placement="top">
      <pixiu-icon
        :name="icon"
        size="16px"
        type="el"
        class="icon-box"
        color="#909399"
      />
    </el-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({ icon: String, desc: String });
console.log(props.icon);
</script>

<style scoped>
.index {
  display: flex;
}
.icon-box {
  padding: 4px;
}
</style>
