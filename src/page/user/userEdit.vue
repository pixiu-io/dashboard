<template>
  <!-- 修改用户信息 -->
  <el-dialog
    :model-value="visible"
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
          <span style="font-size: 13px; color: #191919">状态</span>
        </template>
        <el-radio-group v-model="userForm.value.status">
          <el-radio style="margin-right: 16px" :value="0">标准</el-radio>
          <el-radio style="margin-right: 16px" :value="1">只读</el-radio>
          <el-radio :value="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">描述</span>
        </template>
        <el-input v-model="userForm.value.description" type="textarea" :autosize="data.autosize" />
      </el-form-item>
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
import { reactive, ref, getCurrentInstance, watch, onMounted, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { updateUser } from '@/services/user/userService';

const { proxy } = getCurrentInstance();
const emits = defineEmits(['value-change', 'close']);

const props = defineProps({
  dialogTableValue: {
    type: Object,
    default: () => {},
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const userForm = reactive({
  id: 0,
  description: '',
  email: '',
  name: '',
  password: '',
  status: 0,
});

const data = reactive({
  autosize: {
    minRows: 5,
  },
});

const handleClose = () => {
  emits('value-change');
  emits('close');
};

const confirmUpdateUser = async () => {
  const [result, err] = await updateUser(userForm.value.id, userForm.value);
  if (err) {
    proxy.$message.error(err);
    return;
  }

  proxy.$notify.success(`用户(${userForm.value.name}) 更新成功`);
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
