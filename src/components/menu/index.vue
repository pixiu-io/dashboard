<template>
  <template v-for="item in items">
    <el-menu-item
      :index="item.url"
      v-if="
        item.children === undefined ||
        item.children === null ||
        item.children.length <= 0
      "
    >
      <el-icon v-if="item.icon">
        <component :is="item.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.name }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu v-else :index="item.url">
      <template #title>
        <el-icon v-if="item.icon">
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <pixiu-menu :items="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup>
import PixiuMenu from "./index.vue";
const props = defineProps({
  items: Array,
});
</script>

<style scoped></style>
