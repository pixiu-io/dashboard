<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <pixiu-card title="导入标准集群" height="50px" />
    <el-main>
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
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import PixiuCard from "@/components/card/index.vue";
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
</style>
