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
          ><span class="breadcrumb-create-style"> Tasks </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建 Task </span>
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

            <el-form-item label="变量声明" style="margin-top: 10px">
              <el-button type="text" class="app-action-btn" @click="addParams">新增</el-button>
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.params"
              :key="index"
              class="labels-item-style"
            >
              <el-form-item
                :prop="'params[' + index + '].name'"
                :rules="[{ required: false, message: '变量名可以为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.name" placeholder="变量名" style="width: 280px" />
              </el-form-item>

              <div style="margin-right: 10px; margin-left: 10px">=</div>

              <!--              <el-form-item-->
              <!--                :prop="'annotations[' + index + '].value'"-->
              <!--                :rules="[{ required: false, message: '参数类型可以为空', trigger: 'blur' }]"-->
              <!--              >-->
              <!--                <el-input v-model="item.value" placeholder="参数类型" style="width: 280px" />-->
              <!--              </el-form-item>-->

              <el-form-item
                :prop="'params[' + index + '].value'"
                :rules="[{ required: false, message: '变量值可以空', trigger: 'blur' }]"
              >
                <el-input v-model="item.default" placeholder="变量值" style="width: 280px" />
                <!--                <el-select v-model="item.value" placeholder="变量值" style="width: 280px">-->
                <!--                  <el-option-->
                <!--                    v-for="(option, optionIndex) in ['string', 'number']"-->
                <!--                    :key="optionIndex"-->
                <!--                    :label="option"-->
                <!--                    :value="option"-->
                <!--                  ></el-option>-->
                <!--                </el-select>-->
              </el-form-item>

              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteParams(index)"
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
              参数键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
            </div>

            <el-form-item label="任务配置" style="margin-top: 10px; margin-bottom: 10px">
              <el-button type="text" class="app-action-btn" @click="addStep">增加任务</el-button>
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.steps"
              :key="index"
              style="margin-top: -25px"
            >
              <el-card
                style="
                  width: 99%;
                  height: 185px;
                  background-color: #f2f2f2;
                  margin-top: 20px;
                  border-radius: 0px;
                "
              >
                <div style="float: right; cursor: pointer" @click="deleteStep(index)">
                  <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                </div>

                <el-form-item
                  class="deploy-pixiu-column"
                  :prop="'steps[' + index + '].name'"
                  :rules="[{ required: true, message: '任务名不能为空', trigger: 'blur' }]"
                  >任务名称
                  <el-input
                    v-model="item.name"
                    class="deploy-pixiu-incard"
                    style="margin-left: 30px"
                  />
                </el-form-item>

                <el-form-item
                  style="margin-top: 10px"
                  class="deploy-pixiu-column"
                  :prop="'steps[' + index + '].image'"
                  :rules="[{ required: true, message: '镜像不能为空', trigger: 'blur' }]"
                  >镜像
                  <el-input
                    v-model="item.image"
                    style="margin-left: 58px"
                    class="deploy-pixiu-incard"
                  />
                </el-form-item>

                <el-form-item
                  style="margin-top: 10px"
                  class="deploy-pixiu-column"
                  :prop="'steps[' + index + '].script'"
                  :rules="[{ required: true, message: '脚本不能为空', trigger: 'blur' }]"
                  >脚本
                  <el-input
                    v-model="item.script"
                    style="margin-left: 58px"
                    type="textarea"
                    class="deploy-pixiu-incard"
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
import { createTask } from '@/services/cicd/tektonService';

const ruleFormRef = ref();

const { proxy } = getCurrentInstance();

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
    params: [],
    labels: [],
    steps: [],
  },
  // 创建或者更新 form
  objectForm: {
    apiVersion: 'tekton.dev/v1',
    kind: 'Task',
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      params: [],
      steps: [],
    },
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Task 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  getNamespaces();
  addStep();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.objectForm.metadata = data.form.metadata;
      data.objectForm.spec.steps = data.form.steps;
      data.objectForm.spec.params = data.form.params;

      // 追加 labels
      if (data.form.labels.length > 0) {
        data.objectForm.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.objectForm.metadata['labels'][item.key] = item.value;
        }
      }

      // 追加 annotations
      // if (data.form.params.length > 0) {
      //   data.objectForm.spec['annotations'] = {};
      //   for (let item of data.form.annotations) {
      //     data.objectForm.metadata['annotations'][item.key] = item.value;
      //   }
      // }

      const [result, err] = await createTask(data.cluster, data.namespace, data.objectForm);
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

const addParams = () => {
  data.form.params.push({
    name: '',
    default: '',
  });
};

const deleteLabel = (index) => {
  data.form.labels.splice(index, 1);
};

const deleteParams = (index) => {
  data.form.params.splice(index, 1);
};

const addStep = () => {
  data.form.steps.push({
    name: '',
    image: '',
    script: '',
  });
};

const deleteStep = (index) => {
  if (data.form.steps.length === 1) {
    proxy.$notify.error('至少需要 1 个任务组');
    return;
  }
  data.form.steps.splice(index, 1);
};

const backToTask = () => {
  proxy.$router.push({
    name: 'task',
    query: data.query,
  });
};
</script>

<style></style>
