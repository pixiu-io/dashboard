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
  namespace: 'default',
  cluster: '',
  pod: 'nginx-7df5d5dcb7-5pb95',
  container: '',
  command: '/bin/sh',
});

onMounted(() => {
  Object.assign(webShellOptions, route.query);
});

// const webshelloptions = {
//   namespace: 'pixiu-system',
//   cluster: 'pixiu-fwswbctm',
//   pod: 'helm-toolbox-0',
//   container: '',
//   command: '/bin/sh',
// };
</script>

<style scoped="scoped"></style>
