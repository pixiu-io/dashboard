<template>
  <router-view />
</template>

<script setup>
import { provide } from 'vue';
import * as echarts from 'echarts';

provide('echarts', echarts);
</script>

<style></style>
