<template>
  <div class="index">
    <slot>
    </slot>
    <el-tooltip class="box-item" effect="dark" :content="desc" placement="top">
      <component :is="icon" class="icon-box"></component>
    </el-tooltip>

  </div>
</template>

<script setup>
defineProps({icon: String,desc:String})
</script>

<style scoped>
.index{
  display: flex;
}
.icon-box {
  width: 16px;
  height: 16px;
  padding: 4px;
}
</style>