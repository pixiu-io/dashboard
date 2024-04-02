<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToTask"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> TaskRuns </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建 TaskRun </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card class="create-card-style">
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
              <el-input v-model="data.form.metadata.name" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <el-form-item label="Labels" style="margin-top: 10px">
              <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.labels"
              :key="index"
              class="labels-item-style"
            >
              <el-form-item
                :prop="'labels[' + index + '].key'"
                :rules="[{ required: true, message: '标签键不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
              </el-form-item>

              <div style="margin-right: 10px; margin-left: 10px">=</div>

              <el-form-item
                :prop="'labels[' + index + '].value'"
                :rules="[{ required: true, message: '标签值不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
              </el-form-item>

              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteLabel(index)"
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
            <div class="app-pixiu-line-describe" style="margin-top: -5px">
              标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
            </div>
            <el-form-item label="命名空间" style="margin-top: 10px; margin-bottom: 10px">
              <el-input v-model="data.namespace" style="width: 120px" />
            </el-form-item>
            <el-form-item label="服务账号" style="margin-top: 10px; margin-bottom: 10px">
              <el-input v-model="data.form.serviceAccountName" style="width: 120px" />
            </el-form-item>

            <el-form-item label="Task配置" style="margin-top: 10px; margin-bottom: 10px">
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item style="margin-top: -25px">
              <el-card
                style="
                  width: 99%;
                  height: 120px;
                  background-color: #f2f2f2;
                  margin-top: 20px;
                  border-radius: 0px;
                "
              >
                <div style="float: right; cursor: pointer">
                  <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                </div>

                <el-form-item class="deploy-pixiu-column" prop="taskRef.name"
                  >Task名称
                  <el-input
                    v-model="data.form.taskRef.name"
                    class="deploy-pixiu-incard"
                    style="margin-left: 30px"
                  />
                </el-form-item>
                <el-form-item class="deploy-pixiu-column" prop="taskRef.kind"
                  >Kind
                  <el-input
                    v-model="data.form.taskRef.kind"
                    class="deploy-pixiu-incard"
                    style="margin-left: 55px; margin-top: 10px"
                  />
                </el-form-item>
              </el-card>
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
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createTaskRun, getTaskRunList } from '@/services/cicd/tektonService';

const ruleFormRef = ref();

const { proxy } = getCurrentInstance();

let taskRunsList;
const data = reactive({
  loading: false,

  cluster: '',
  clusterName: '',
  namespace: 'default',

  namespaces: [],

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    serviceAccountName: 'default',
    taskRef: {
      name: '',
      kind: 'Task',
    },
  },
  // 创建或者更新 form
  objectForm: {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      serviceAccountName: 'default',
      taskRef: {
        name: '',
        kind: '',
      },
    },
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Task 名称', trigger: 'blur' }],
  'taskRef.name': [{ required: true, message: '任务名不能为空', trigger: 'blur' }],
  'taskRef.kind': [{ required: true, message: 'Kind不能为空', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  if (typeof data.query.taskName !== 'undefined') {
    data.form.taskRef.taskName = data.query.taskName;
  }
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;
};

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.objectForm.metadata = data.form.metadata;
      data.objectForm.spec.taskRef = data.form.taskRef;
      // 追加 labels
      if (data.form.labels.length > 0) {
        data.objectForm.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.objectForm.metadata['labels'][item.key] = item.value;
        }
      }

      const [result, err] = await createTaskRun(data.cluster, data.namespace, data.objectForm);
      if (err) {
        proxy.$notify.error(err.response.data.message);
        return;
      }
      proxy.$notify.success(`Task ${data.form.metadata.name} 创建成功`);

      backToTask();
    }
  });
};

const cancel = () => {
  backToTask();
};

const addLabel = () => {
  data.form.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.form.labels.splice(index, 1);
};

const backToTask = () => {
  proxy.$router.push({
    name: 'taskrun',
    query: data.query,
  });
};
</script>

<style></style>
