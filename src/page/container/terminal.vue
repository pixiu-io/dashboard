<template>
  <!-- xterm虚拟终端 -->
  <web-shell :webshelloptions="webshelloptions"></web-shell>
</template>

<script setup>
import WebShell from '@/components/webshell/index.vue';

const webshelloptions = {
  namespace: 'pixiu-system',
  cluster: 'pixiu-omsukaom',
  pod: 'helm-toolbox-0',
  container: '',
  command: '/bin/sh',
};
</script>

<style scoped="scoped"></style>
