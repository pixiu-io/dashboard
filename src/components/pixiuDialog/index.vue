<template>
  <el-dialog
    :model-value="closeEvent"
    style="color: #191919; font: 14px"
    width="480px"
    align-center
    center
    @close="cancel"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 12px;
          margin-top: 5px;
          font-size: 14.5px;
        "
      >
        删除{{ objectName }}
      </div>
    </template>

    <!-- <div style="margin-top: -6px; font-weight: bold; font-size: 13.5px; color: #000">
      此操作将永久删除{{ objectName }} (<span style="color: red">{{ deleteName }}</span
      >) 是否继续？
    </div> -->

    <el-card class="app-docs" style="margin-left: 6px; margin-top: -20px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div v-if="bulkDelete" style="vertical-align: middle; margin-top: -40px">
        此操作将<span style="color: red"> 批量 </span>删除选中的 {{ objectName }} ， 是否继续？
      </div>
      <div v-else>
        <div v-if="aliasName !== ''" style="vertical-align: middle; margin-top: -40px">
          此操作将永久删除 {{ objectName }} (<span style="color: red"> {{ aliasName }}</span
          >)， 是否继续？
        </div>
        <div v-else style="vertical-align: middle; margin-top: -40px">
          此操作将永久删除 {{ objectName }} (<span style="color: red"> {{ deleteName }}</span
          >)， 是否继续？
        </div>
      </div>
    </el-card>

    <div style="margin-top: -5px" />
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancel">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirm"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 8px" />
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  closeEvent: { type: Boolean, default: false },
  objectName: { type: String, default: '' },
  deleteName: { type: String, default: '' },
  aliasName: { type: String, default: '' },
  bulkDelete: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped></style>
