<template>
  <!-- 修改用户信息 -->
  <el-dialog
    :model-value="dialogVisble"
    style="color: #000000; font: 14px"
    width="360px"
    center
    @close="handleClose"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">修改用户</div>
    </template>
    <el-form label-width="100px" :model="userForm.value" style="max-width: 260px">
      <el-form-item label="名字:" required>
        <el-input v-model="userForm.value.name" disabled />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="userForm.value.description" required="" />
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input v-model="userForm.value.email" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="userForm.value.status"
          class="ml-2"
          style="--el-switch-on-color: #409eff; --el-switch-off-color: #ff4949"
          :active-value="1"
          :inactive-value="0"
          size="large"
          inline-prompt
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmUpdateUser()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, watch } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const emits = defineEmits(['update:modelValue', 'valueChange']);

const userForm = reactive({
  id: 0,
  description: '',
  email: '',
  name: '',
  password: '',
  status: 1,
});

const props = defineProps({
  dialogTableValue: {
    type: Object,
    default: () => {},
  },
});

const handleClose = () => {
  emits('update:modelValue', false);
};

const confirmUpdateUser = async () => {
  await proxy
    .$http({
      method: 'put',
      url: `/users/${userForm.value.id}`,
      data: userForm.value,
    })
    .then(() => {
      emits('valueChange');
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    });
  handleClose();
};

watch(
  () => props.dialogTableValue,
  () => {
    userForm.value = props.dialogTableValue;
  },
  { deep: true, immediate: true },
);
</script>

<style></style>
