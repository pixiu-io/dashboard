<template>
  <div v-for="item in items">
    <el-menu-item
      v-if="
        item.children === undefined ||
        item.children === null ||
        item.children.length <= 0
      "
    >
      <template #title>
        <span>{{ item.name }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu v-else :index="item.id">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <pixiu-menu :items="item.children" />
    </el-sub-menu>
  </div>
</template>

<script setup>
import PixiuMenu from "./index.vue";
const props = defineProps({
  items: Array,
});
</script>

<style scoped></style>
