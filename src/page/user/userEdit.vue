<template>
  <!-- 修改用户信息 -->
  <el-dialog v-model="dialogVisble" style="color: #000000; font: 14px" width="360px" center
    @close="dialogVisble = false"  v-if="dialogVisble">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        修改用户
      </div>
    </template>
    <el-form :label-position="labelPosition" label-width="100px" :model="user" style="max-width: 260px">
      <el-form-item label="名字:" required>
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="user.description" required="" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="user.status" class="ml-2"
          style="--el-switch-on-color: #409EFF; --el-switch-off-color: #ff4949" :active-value="1" :inactive-value="0"
          size="large" inline-prompt active-text="启用" inactive-text="禁用" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="user.password" type="password" show-password />
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
const props = defineProps(['user'])
const { user } = toRefs(props)

const confirmUpdateUser = async () => {
  const resp = await proxy.$http({
    method: "put",
    url: "/users/" + user.value.id,
    data: user.value,
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

