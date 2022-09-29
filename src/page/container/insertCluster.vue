<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <div class="app-pixiu-header-title">导入标准集群</div>
    </el-card>

    <el-card style="margin-top: 20px">
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
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PixiuRadioCard from "@/components/radioCard/index.vue";
const { proxy } = getCurrentInstance();
const data = reactive({
  loading: false,
});

const labelPosition = ref("left");

const formLabelAlign = reactive({
  name: "",
  region: "",
  type: "",
  description: "",
});

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

<style>
.box-card {
  margin-top: 20px;
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
