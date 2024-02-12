<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 20px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToStorageClass"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群: {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> StorageClasses </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建StorageClass </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 10px; width: 75%; border-radius: 0px">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.form"
            style="margin-left: 3%; width: 70%"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="名称" prop="metadata.name" style="width: 500px">
              <el-input v-model="data.form.metadata.name" placeholder="请输入 StorageClass 名称" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <div style="margin-top: 35px" />
            <el-form-item>
              <el-button
                style="margin-left: 15%"
                class="pixiu-confirm-button"
                type="primary"
                @click="confirm()"
                >确定</el-button
              >
              <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const data = reactive({
  loading: false,

  cluster: '',
  clusterName: '',

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    containers: [],
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 StorageClass 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
});

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
    }
  });
};
const cancel = () => {
  backToStorageClass();
};

const backToStorageClass = () => {
  proxy.$router.push({
    name: 'StorageClass',
    query: data.query,
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
