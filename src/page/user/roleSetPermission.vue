<template>
  <!-- 分配角色 -->
  <el-dialog v-model="dialogVisble" style="color: #000000; font: 14px" width="360px" center
    @close="dialogVisble = false" v-if="dialogVisble">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        授权
      </div>
    </template>
    <div>
      <el-tree ref="menusRef" node-key="id" :data="menuList" :default-checked-keys="roleMenus" default-expand-all
        show-checkbox>
        <template #default="{ data: { name } }">
          {{ name }}</template>
      </el-tree>
      <el-divider />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisble = false">取消</el-button>
        <el-button type="primary" @click="confirmSetPermission()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import { toRefs, ref, getCurrentInstance, reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const dialogVisble = ref(null)
const props = defineProps(['role', 'roleMenus', 'menuList'])
const { role, roleMenus, menuList } = toRefs(props)
const menusRef = ref(null)

const data = reactive({
  menuForm: {
    menu_ids: [],
  },
})

const confirmSetPermission = async () => {
  const menuIds = menusRef.value.getCheckedKeys();
  data.menuForm["menu_ids"] = menuIds
  const res = await proxy.$http({
    method: "post",
    url: "/roles/" + role.value.id + "/menus",
    data: data.menuForm,
  });

  dialogVisble.value = false
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "分配成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: res.message,
    });
  }
}

defineExpose({
  dialogVisble
})
</script>

