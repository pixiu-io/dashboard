<template>
  <!-- 分配角色 -->
  <el-dialog v-model="dialogVisble" style="color: #000000; font: 14px" width="360px" center
    @close="dialogVisble = false" v-if="dialogVisble">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        分配角色
      </div>
    </template>
    <div>
      <el-tree ref="menusRef" node-key="id" 
      :data="roleList" 
      :default-checked-keys="userRole" 
      check-strictly
        default-expand-all show-checkbox>
        <template #default="{ data: { name } }">
          {{ name }}</template>
      </el-tree>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisble = false">取消</el-button>
        <el-button type="primary" @click="confirmSetRole()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import { toRefs, ref, getCurrentInstance, reactive } from 'vue'
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const dialogVisble = ref(null)
const props = defineProps(['userRole','user',"roleList"])
const { userRole,user,roleList} = toRefs(props)
const menusRef = ref(null)

const data = reactive({
  roleForm: {
    role_ids: [],
  },
})

const confirmSetRole = async () => {
  const menuIds = menusRef.value.getCheckedKeys();
  data.roleForm["role_ids"] = menuIds
  const res = await proxy.$http({
    method: "post",
    url: "/users/" + user.value.id + "/roles",
    data: data.roleForm,
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

