<template>
  <div
    style="
      background-color: #29232b;
      color: white;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
    "
  >
    <MyMonaco :yaml="data.data" :height="data.dialogHeight" :read-only="readOnly"></MyMonaco>
  </div>
</template>

<script setup lang="jsx">
import MyMonaco from '@/components/monaco/index.vue';
import { reactive } from 'vue';

const data = reactive({
  data: '',
  dialogWidth: 300,
  dialogHeight: 400,
});

const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
</script>

<style></style>
