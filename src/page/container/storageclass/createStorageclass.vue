<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
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
              <div class="app-pixiu-line-describe2" style="margin-top: -2px">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <el-form-item label="Provisioner" prop="provisioner" style="width: 500px">
              <el-input v-model="data.form.provisioner" placeholder="请输入 Provisioner" />
            </el-form-item>

            <el-form-item label="回收策略">
              <el-radio-group v-model="data.form.reclaimPolicy">
                <el-radio-button label="Delete">Delete</el-radio-button>
                <el-radio-button label="Retain">Retain</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="存储参数">
              <el-button type="text" class="app-action-btn" @click="addParameter">新增</el-button>
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.parameters"
              :key="index"
              class="labels-item-style"
            >
              <el-form-item
                :prop="'parameters[' + index + '].key'"
                :rules="[{ required: true, message: '参数键不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.key" placeholder="参数键" style="width: 200px" />
              </el-form-item>

              <div style="margin-right: 10px; margin-left: 10px">=</div>

              <el-form-item
                :prop="'parameters[' + index + '].value'"
                :rules="[{ required: true, message: '参数值不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.value" placeholder="参数值" style="width: 200px" />
              </el-form-item>

              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteParameter(index)"
              >
                <pixiu-icon
                  name="icon-shanchu"
                  size="14px"
                  type="iconfont"
                  style="margin-top: 10px; margin-left: 4px"
                  color="#909399"
                />
              </div>
            </el-form-item>

            <el-form-item label="绑定模式">
              <el-radio-group v-model="data.form.volumeBindingMode">
                <el-radio-button label="Immediate">Immediate</el-radio-button>
                <el-radio-button label="WaitForFirstConsumer">WaitForFirstConsumer</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <div style="margin-top: 10px" />
            <el-form-item label="挂载选项"> </el-form-item>

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
    },
    provisioner: '',
    parameters: [],
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'Immediate',
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 StorageClass 名称', trigger: 'blur' }],
  provisioner: [{ required: true, message: '请输入 StorageClass Provisioner', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  addParameter();
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

const addParameter = () => {
  data.form.parameters.push({
    key: '',
    value: '',
  });
};

const deleteParameter = (index) => {
  data.form.parameters.splice(index, 1);
};

const backToStorageClass = () => {
  proxy.$router.push({
    name: 'StorageClass',
    query: data.query,
  });
};
</script>

<style scoped="scoped">
.el-main {
  background-color: #f3f4f7;
}
</style>
