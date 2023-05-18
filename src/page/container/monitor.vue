<template>
  <iframe
    ref="iframe"
    :src="data.grafanaUrl"
    style="height: calc(100% - 50px)"
    width="100%"
    frameborder="0"
  ></iframe>
</template>

<script setup>
import { reactive } from 'vue';
const data = reactive({
  grafanaUrl:
    'http://192.168.17.38:3000/d/hb7fSE0Zz/node-exporter?orgId=1&refresh=5s&kiosk=tv&theme=light',
});
</script>

<style scoped="scoped"></style>
