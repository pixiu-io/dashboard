<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="backToNamespace"
          ><span style="color: black; cursor: pointer"> 命名空间 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color: black">{{ data.cluster }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: black"> 新建命名空间 </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <div
    class="deployee-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form
            require-asterisk-position="right"
            ref="ruleFormRef"
            label-position="left"
            label-width="100px"
            status-icon
            :rules="rules"
            style="margin-left: 3%; width: 80%"
          >
            <div style="margin-top: 20px" />

            <el-form-item label="名称" prop="name" style="width: 400px">
              <el-input v-model="data.namespaceForm.metadata.name" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="描述" style="width: 60%">
              <el-input
                v-model="data.namespaceForm.description"
                placeholder="请输入命名空间的描述信息"
                type="textarea"
                :autosize="data.autosize"
              />
            </el-form-item>

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="confirm()"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref(null);

const data = reactive({
  loading: false,
  cluster: '',
  autosize: {
    minRows: 5,
  },

  namespaceForm: {
    metadata: {
      name: '',
    },
  },
});

const confirm = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const resp = await proxy.$http({
          method: 'post',
          url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces`,
          data: data.namespaceForm,
        });
        proxy.$message.success(`命名空间 ${data.namespaceForm.metadata.name} 创建成功`);
        backToNamespace();
      } catch (error) {}
    }
  });
};

const cancel = () => {
  backToNamespace();
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;

  data.path = proxy.$route.fullPath;
});

const rules = {
  name: [{ required: true, message: '请输入命名空间名称', trigger: 'blur' }],
};

const backToNamespace = () => {
  proxy.$router.push({
    name: 'Namespace',
    query: data.query,
  });
};
</script>

<style></style>
