<template>
  <!-- xterm虚拟终端 -->
  <web-shell :info="info"></web-shell>
</template>

<script setup>
import WebShell from '@/components/webshell/index.vue';

const info = {
  namespace: 'kube-system',
  cloud: 'atm-b5870ad4',
  pod: 'kubepi-679c77b8bb-2sw96',
  container: '',
};
</script>

<style scoped="scoped"></style>
