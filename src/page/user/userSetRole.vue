<template>
  <!-- 分配角色 -->
  <el-dialog
    :model-value="dialogVisble"
    style="color: #000000; font: 14px"
    width="360px"
    center
    @close="handleClose"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">分配角色</div>
    </template>
    <div>
      <el-tree
        ref="menusRef"
        node-key="id"
        :data="roleList"
        :default-checked-keys="defaultCheckedRoles"
        check-strictly
        default-expand-all
        show-checkbox
      >
        <template #default="{ data: { name } }"> {{ name }}</template>
      </el-tree>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmSetRole()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { toRefs, ref, getCurrentInstance, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
  defaultCheckedRoles: {
    type: Array,
    default: () => [],
  },
  roleList: {
    type: Array,
    default: () => [],
  },
});
const { defaultCheckedRoles, user, roleList } = toRefs(props);

const menusRef = ref(null);
const data = reactive({
  roleForm: {
    role_ids: [],
  },
});

const emits = defineEmits(['update:modelValue', 'valueChange']);

const handleClose = () => {
  emits('update:modelValue', false);
};

watch(
  () => user,
  () => {},
  { deep: true, immediate: true },
);

const confirmSetRole = async () => {
  const roleIds = menusRef.value.getCheckedKeys();
  data.roleForm.role_ids = roleIds;

  try {
    await proxy
      .$http({
        method: 'post',
        url: `/users/${user.value.id}/roles`,
        data: data.roleForm,
      })
      .then(() => {
        emits('valueChange');
        ElMessage({
          type: 'success',
          message: '分配成功',
        });
      });
  } catch (error) {}

  handleClose();
};
</script>
