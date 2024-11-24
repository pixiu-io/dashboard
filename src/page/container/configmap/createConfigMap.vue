<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
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

            <el-divider />
            <el-form-item label="内容" style="margin-top: 10px">
              <!-- <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button> -->
              <div class="configmap-label-title" style="margin-left: 5px">变量名</div>
              <div class="configmap-label-title" style="margin-left: 305px">变量值</div>
              <el-divider />
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.configMapLabels"
              :key="index"
              style="margin-top: -20px"
            >
              <el-form-item prop="item.key">
                <el-input v-model="item.key" placeholder="变量名" style="width: 300px" />
              </el-form-item>
              <div style="margin-right: 8px; margin-left: 8px"></div>
              =
              <div>
                <el-input
                  v-model="item.value"
                  placeholder="请输入变量值"
                  autosize
                  type="textarea"
                  style="width: 350px; margin-left: 20px"
                />
              </div>
              <div
                style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
                @click="deleteLabel(index)"
              >
                <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
              </div>
              <el-divider />
            </el-form-item>
            <div class="app-pixiu-line-describe4">
              只能包含字母、数字及分隔符"."; 变量名为空时，在变量名称中粘贴一行或多行 key=value key:
              value 的键值对可以实现快速批量输入
            </div>
            <el-form-item>
              <el-button
                class="table-inline-btn"
                style="margin-left: -14px; margin-right: -20px; margin-top: 15px"
                @click="addLabel"
                >手动增加</el-button
              >
              <el-button class="table-inline-btn" style="margin-top: 15px" @click="addLabel"
                >文件导入</el-button
              >
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

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const data = reactive({
  loading: false,
  cluster: '',
  clusterName: '',

  namespaces: [],

  configMapLabels: [{ key: null, value: null }],

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

const comfirmCreate = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.configMapLabels.forEach((item) => {
        data.configmapForm.data[item.key] = item.value;
      });
      try {
        const resp = await proxy.$http({
          method: 'post',
          url:
            `/pixiu/proxy/${data.cluster}/api/v1/namespaces/` +
            data.configmapForm.metadata.namespace +
            `/configmaps`,
          data: data.configmapForm,
        });
        proxy.$message.success(`configmap ${data.configmapForm.metadata.name} 创建成功`);
        backToConfigmap();
      } catch (error) {}
    }
  });
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

<style>
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.deployee-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}

.configmap-label-title {
  font-size: 12px;
  color: #888888;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.deploy-pixiu-column {
  font-size: 13px;
  color: #606266;
}

.deploy-pixiu-incard {
  /* width: 323px; */
  width: 53%;
}

.container-line-describe {
  margin-left: 90px;
  font-size: 12px;
  color: #888888;
}

.deployee-class .el-radio {
  background-color: white;
  border-radius: 0;
  margin-right: 0;
  width: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deployee-class .el-radio.is-bordered.is-checked {
  border-color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__input.is-checked + .el-radio__label {
  color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__label {
  font-size: 13px;
}

.deployee-class .el-radio__inner {
  display: none;
}
</style>
