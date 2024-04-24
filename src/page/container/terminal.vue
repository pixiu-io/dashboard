<template>
  <!-- xterm虚拟终端 -->
  <web-shell v-if="webShellOptions.cluster !== ''" :webshelloptions="webShellOptions"></web-shell>
</template>

<script setup>
import WebShell from '@/components/webshell/index.vue';
import { onMounted, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const webShellOptions = reactive({
  namespace: '',
  cluster: '',
  pod: '',
  container: '',
  command: '/bin/sh',
});

onMounted(() => {
  Object.assign(webShellOptions, route.query);

  // 设置页面 title
  const clusterName = localStorage.getItem(webShellOptions.cluster);
  document.title = `容器集群: ${clusterName} Pod: ${webShellOptions.pod}(${webShellOptions.namespace}) 容器: ${webShellOptions.container}`;
});
</script>

<style scoped="scoped"></style>
