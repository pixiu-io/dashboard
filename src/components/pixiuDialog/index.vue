<template>
  <el-dialog
    :model-value="closeEvent"
    style="color: #000000; font: 14px; height: 190px"
    width="500px"
    align-center
    center
  >
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  closeEvent: { type: Boolean, default: false },
  //   dialogTitle: { type: String, default: '' },
});

const emit = defineEmits(['onChange']);

const onChange = () => {
  emit('onChange', page);
};
</script>

<style scoped></style>
