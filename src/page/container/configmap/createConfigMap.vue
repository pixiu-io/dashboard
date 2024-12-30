<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 60px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToConfigmap"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> ConfigMaps </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建ConfigMap </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card class="create-card-style" style="width: 75%">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.namespaceForm"
            class="create-card-form"
          >
            <div style="margin-top: 20px" />

            <el-form-item>
              <template #label>
                <span class="form-item-key-style">名称 </span>
              </template>
              <el-input
                v-model="data.configmapForm.metadata.name"
                style="width: 40%"
                class="form-item-key-style"
                placeholder="请输入 configMap 名称"
              />
            </el-form-item>
            <el-form-item>
              <div class="dialog-describe-style" style="margin-left: 10px; margin-top: -18px">
                最长63个字符，只能包含小写字母、数字及分隔符("-"),且必须以小写字母开头，数字或小写字母结尾
              </div>
            </el-form-item>

            <el-form-item>
              <template #label>
                <span class="form-item-key-style">命名空间 </span>
              </template>
              <span style="margin-left: 8px">
                <el-select
                  v-model="data.configmapForm.metadata.namespace"
                  style="width: 210px; float: right; margin-right: 10px"
                  @change="changeNamespace"
                >
                  <el-option
                    v-for="item in data.namespaces"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </span>
              <div style="margin-left: 2px; margin-top: 7px">
                <pixiu-icon
                  name="icon-icon-refresh"
                  style="cursor: pointer"
                  size="16px"
                  type="iconfont"
                  color="#909399"
                  @click="getNamespaceList"
                />
              </div>
            </el-form-item>

            <!-- <el-divider /> -->

            <el-form-item>
              <template #label>
                <span class="form-item-key-style">内容</span>
              </template>
              <el-button
                type="text"
                class="app-action-btn"
                style="margin-top: 1px"
                @click="addLabel"
                >+增加配置</el-button
              >
            </el-form-item>

            <div style="margin-top: -30px"></div>
            <el-form-item
              v-for="(item, index) in data.configMapLabels"
              :key="index"
              style="margin-top: -20px"
            >
              <div
                style="width: 85%; background-color: #f2f2f2; margin-top: 20px; border-radius: 0px"
              >
                <div
                  style="float: right; cursor: pointer; margin-top: 10px; margin-right: 15px"
                  @click="deleteLabel(index)"
                >
                  <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                </div>

                <div style="margin-top: 10px"></div>
                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style" style="margin-left: 20px">变量名</span>
                  </template>
                </el-form-item>
                <el-form-item prop="item.key">
                  <el-input v-model="item.key" style="margin-left: 20px; width: 95%" />
                </el-form-item>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style" style="margin-left: 20px">变量值</span>
                  </template>
                </el-form-item>
                <el-form-item prop="item.value">
                  <el-input
                    v-model="item.value"
                    style="margin-left: 20px; width: 95%"
                    type="textarea"
                    :autosize="data.autosize"
                  />
                </el-form-item>
                <div style="margin-top: 25px"></div>
              </div>
            </el-form-item>

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="comfirmCreate()"
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
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createConfigMap } from '@/services/kubernetes/configmapService';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const data = reactive({
  loading: false,
  cluster: '',
  clusterName: '',

  namespaces: [],

  configMapLabels: [{ key: null, value: null }],
  autosize: {
    minRows: 4,
  },

  // configmap 创建初始对象
  configmapForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    data: {},
  },
  tableData: [
    {
      key: '',
      value: '',
    },
  ],
  configmapDialog: false,
  configmapDataFrom: {
    key: '',
    value: '',
    target: 0,
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 ConfigMap 名称', trigger: 'blur' }],
};

const comfirmCreate = async () => {
  data.configmapForm.data = {};
  data.configMapLabels.forEach((item) => {
    data.configmapForm.data[item.key] = item.value;
  });

  const [result, err] = await createConfigMap(
    data.cluster,
    data.configmapForm.metadata.namespace,
    data.configmapForm,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  proxy.$message.success(`configmap ${data.configmapForm.metadata.name} 创建成功`);
  backToConfigmap();
};

const cancelCreate = () => {
  backToConfigmap();
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  data.configmapForm.metadata.namespace = proxy.$route.query.namespace;
  getNamespaceList();
});

const changeNamespace = async (val) => {
  data.configmapForm.metadata.namespace = val;
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

// 回到 configmap 页面
const backToConfigmap = () => {
  proxy.$router.push({
    name: 'ConfigMap',
    query: data.query,
  });
};

const addLabel = () => {
  data.configMapLabels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.configMapLabels.splice(index, 1);
};
</script>

<style></style>
