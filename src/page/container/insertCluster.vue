<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <div class="app-pixiu-header-title">导入标准集群</div>
    </el-card>

    <div class="app-pixiu-content-card">
      <el-card style="margin-top: 30px; width: 75%">
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 460px"
        >
          <el-form-item label="集群名称">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
          <el-form-item label="所在地域">
            <el-input v-model="formLabelAlign.region" />
          </el-form-item>

          <el-form-item label="集群描述">
            <el-input v-model="formLabelAlign.description" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >完成</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const data = reactive({
  loading: false,
});

const formLabelAlign = reactive({
  name: "",
  region: "",
  type: "",
  description: "",
});

const labelPosition = ref("left");

const jumpRoute = (row) => {
  proxy.$router.push({
    name: "Kubernetes",
    params: {
      id: row.id,
      name: row.name,
    },
  });
};
</script>

<style scoped="scoped">
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.el-main {
  background-color: #f3f4f7;
}

.app-pixiu-header-title {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  font-size: 16px;
  font-weight: 700;
  margin-right: 20px;
  max-width: 70%;
}
</style>
