<template>
  <el-dialog
    :model-value="closeEvent"
    style="color: #000000; font: 14px; height: 190px"
    width="500px"
    align-center
    center
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
        "
      >
        {{ dialogTitle }}
      </div>
    </template>

    <div style="margin-top: -6px; font-weight: bold; font-size: 13.5px; color: #000">
      此操作将永久删除{{ objectName }} (<span style="color: red">{{ deleteName }}</span
      >) 是否继续？
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancel">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirm"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  closeEvent: { type: Boolean, default: false },
  dialogTitle: { type: String, default: '' },
  objectName: { type: String, default: '' },
  deleteName: { type: String, default: '' },
});

const emit = defineEmits(['confirm']);

const confirm = () => {
  console.log('里面 confirm');
  emit();
};

const cancel = () => {
  console.log('里面 cancel');
  emit();
};
</script>

<style scoped></style>
