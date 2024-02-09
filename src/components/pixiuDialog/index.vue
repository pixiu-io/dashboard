<template>
  <el-dialog
    :model-value="closeEvent"
    style="color: #000000; font: 14px; height: 190px"
    width="500px"
    align-center
    center
  >
    <div style="margin-top: -6px; font-weight: bold; font-size: 13.5px; color: #000">
      此操作将永久删除{{ objectName }} (<span style="color: red">{{ dialogTitle }}</span
      >) 是否继续？
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  closeEvent: { type: Boolean, default: false },
  dialogTitle: { type: String, default: '' },
  objectName: { type: String, default: '' },
});

const emit = defineEmits(['onChange']);

const onChange = () => {
  emit('onChange', page);
};
</script>

<style scoped></style>
