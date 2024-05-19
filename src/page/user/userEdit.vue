<template>
  <!-- 修改用户信息 -->
  <el-dialog
    :model-value="dialogVisble"
    style="color: #000000; font: 14px"
    width="580px"
    center
    @close="handleClose"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">更新用户</div>
    </template>

    <el-form label-width="80px" :model="userForm.value" style="max-width: 450px">
      <el-form-item required>
        <template #label>
          <span style="font-size: 13px; color: #191919">用户名称</span>
        </template>
        <el-input v-model="userForm.value.name" disabled />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">邮箱</span>
        </template>
        <el-input v-model="userForm.value.email" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">描述</span>
        </template>
        <el-input v-model="userForm.value.description" type="textarea" :autosize="data.autosize" />
      </el-form-item>

      <!-- <el-form-item label="状态:">
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
      </el-form-item> -->
    </el-form>

    <div style="margin-top: -20px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="handleClose">取消</el-button>
        <el-button class="pixiu-small-confirm-button" type="primary" @click="confirmUpdateUser()"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { updateUser } from '@/services/user/userService';

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

const data = reactive({
  autosize: {
    minRows: 5,
  },
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
  const [result, err] = await updateUser(userForm.value.id, userForm.value);
  if (err) {
    proxy.$message.error(err);
    return;
  }

  proxy.$notify.success(`User(${userForm.value.name} 删除成功`);
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
