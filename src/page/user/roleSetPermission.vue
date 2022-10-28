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
      <div style="text-align: left; font-weight: bold; padding-left: 5px">授权</div>
    </template>
    <div>
      <el-tree
        ref="menusRef"
        node-key="id"
        :data="menuList"
        :default-checked-keys="checkedMenus"
        default-expand-all
        show-checkbox
      >
        <template #default="{ data: { name } }"> {{ name }}</template>
      </el-tree>
      <el-divider />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmSetPermission()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { toRefs, ref, getCurrentInstance, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const props = defineProps({
  role: {
    type: Object,
    default: () => {},
  },
  checkedMenus: {
    type: Array,
    default: () => [],
  },
  menuList: {
    type: Array,
    default: () => [],
  },
});
const { role, checkedMenus, menuList } = toRefs(props);
const menusRef = ref(null);

const data = reactive({
  menuForm: {
    menu_ids: [],
  },
});

const emits = defineEmits(['update:modelValue', 'valueChange']);
const handleClose = () => {
  emits('update:modelValue', false);
};

const confirmSetPermission = async () => {
  const menuIds = menusRef.value.getCheckedKeys().concat(menusRef.value.getHalfCheckedKeys());
  const a = menusRef.value.getHalfCheckedKeys;
  data.menuForm.menu_ids = menuIds;

  try {
    await proxy
      .$http({
        method: 'post',
        url: `/roles/${role.value.id}/menus`,
        data: data.menuForm,
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
