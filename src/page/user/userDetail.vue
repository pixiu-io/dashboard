<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 用户信息 </span>
    </el-card>

    <div style="margin-top: 38px; margin-left: 38px">
      <el-form label-width="80px" style="max-width: 600px">
        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">用户名称</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.name }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">创建时间</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.gmt_create }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">登录密码</span>
          </template>
          <div style="margin-left: 30px">***</div>
          <div style="margin-left: 6px; color: #006eff; font-size: 13px; cursor: pointer">修改</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">用户状态</span>
          </template>
          <div v-if="userForm.status === 0" style="font-size: 13px; margin-left: 30px">正常</div>
          <div v-else-if="userForm.status === 1" style="font-size: 13px; margin-left: 30px">
            只读
          </div>
          <div v-else style="font-size: 13px; margin-left: 30px">禁用</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">邮箱</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.email }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">描述</span>
          </template>
          <el-input
            v-model="userForm.description"
            type="textarea"
            :autosize="data.autosize"
            style="margin-left: 30px"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import { getUser, updatePassword } from '@/services/user/userService';

const { proxy } = getCurrentInstance();

const data = reactive({
  autosize: {
    minRows: 6,
  },

  // 修改密码属性
  passwordData: {
    close: false,
    object: '',
    newObject: {
      resource_version: 0,
      old: '',
      new: '',
      new2: '',
    },
  },
});

const userForm = reactive({
  id: 0,
  description: '',
  gmt_create: '',
  email: '',
  name: '',
  role: 0,
  status: 0,
});

onMounted(() => {
  userForm.id = localStorage.getItem('userId');
  GetUser();
});

const GetUser = async () => {
  const [result, err] = await getUser(userForm.id);
  if (err) {
    proxy.$message.error(err);
    return;
  }

  userForm.name = result.name;
  userForm.description = result.description;
  userForm.gmt_create = formatTimestamp(result.gmt_create);
  userForm.email = result.email;
  userForm.role = result.role;
  userForm.status = result.status;
};
</script>
