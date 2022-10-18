<template>
  <!-- 修改用户信息 -->
  <el-dialog v-model="dialogVisble" style="color: #000000; font: 14px" width="360px" center
    @close="dialogVisble = false" v-if="dialogVisble">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        修改角色
      </div>
    </template>
    <el-form :label-position="labelPosition" label-width="100px" :model="role" style="max-width: 260px">
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
        <el-select v-model="role.parent_id" clearable placeholder="请选择" ref="selectRef">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

      </el-form-item>
      <el-form-item label="状态:">
        <el-switch v-model="role.status" class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value="1" :inactive-value="0"
          size="large" inline-prompt active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisble = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateUser()">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup >
import { toRefs, ref, getCurrentInstance } from 'vue'
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const dialogVisble = ref(null)
const props = defineProps(['role', 'roleList'])
const { role, roleList } = toRefs(props)

const confirmUpdateUser = async () => {
  const resp = await proxy.$http({
    method: "put",
    url: "/roles/" + role.value.id,
    data: role.value,
  });
  dialogVisble.value = false
  if (resp.code === 200) {
    ElMessage({
      type: "success",
      message: "修改成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "修改失败",
    });
  }
};

defineExpose({
  dialogVisble
})
</script>

