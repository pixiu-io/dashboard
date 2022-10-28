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
      <div style="text-align: left; font-weight: bold; padding-left: 5px">修改角色</div>
    </template>
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="role"
      style="max-width: 260px"
    >
      <el-form-item label="名称:" required>
        <el-input v-model="role.name" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="role.memo" required="" />
      </el-form-item>
      <el-form-item label="排序值:">
        <el-input-number v-model="role.sequence" :min="1" :max="10" @change="handleChange" />
      </el-form-item>
      <el-form-item label="父角色:">
        <el-select ref="selectRef" v-model="role.parent_id" clearable placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="role.status"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
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
        <el-button type="primary" @click="confirmUpdateUser()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { toRefs, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();

const props = defineProps({
  role: {
    type: Object,
    default: () => {},
  },
  roleList: {
    type: Array,
    default: () => [],
  },
});
const { role, roleList } = toRefs(props);

const emits = defineEmits(['update:modelValue', 'valueChange']);
const handleClose = () => {
  emits('update:modelValue', false);
};

const confirmUpdateUser = async () => {
  if (role.value.parent_id === '') {
    role.value.parent_id = 0;
  }
  try {
    await proxy
      .$http({
        method: 'put',
        url: `/roles/${role.value.id}`,
        data: role.value,
      })
      .then(() => {
        emits('valueChange');
        ElMessage({
          type: 'success',
          message: '修改成功',
        });
      });
  } catch (error) {}

  handleClose();
};
</script>
