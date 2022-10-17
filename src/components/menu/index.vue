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
      <pixiu-icon
        v-if="item.icon"
        :iconName="item.icon"
        :iconType="item.iconType"
      ></pixiu-icon>
      <template #title>
        <span>{{ item.name }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu v-else :index="item.url">
      <template #title>
        <el-icon v-if="item.icon">
          <pixiu-icon
            :iconName="item.icon"
            :iconType="item.iconType"
          ></pixiu-icon>
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
