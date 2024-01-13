<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="backToSecret"
          ><span style="color: black; cursor: pointer"> Secret </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color: black">{{ data.cluster }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: black"> 新建 Secret </span>
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
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.configmapForm"
            style="margin-left: 3%; width: 80%"
          >
            <div style="margin-top: 20px" />

            <el-form-item label="名称" prop="metadata.name" style="width: 80%">
              <el-input v-model="data.configmapForm.metadata.name" style="width: 40%" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-"),且必须以小写字母开头，数字或小写字母结尾
              </div>
            </el-form-item>

            <el-form-item label="Secret类型" style="width: 500px; margin-right: 20px">
              <div>
                <el-radio-group v-model="data.secretType">
                  <el-radio-button label="Opaque" />
                  <el-radio-button label="TSL证书" />
                  <el-radio-button label="Dockercfg(镜像仓库访问凭证)" />
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="生效范围" style="margin-top: 20px"></el-form-item>

            <el-form-item style="margin-top: -25px">
              <el-card
                style="
                  width: 90%;
                  height: 185px;
                  background-color: #f2f2f2;
                  margin-top: 20px;
                  border-radius: 0px;
                "
              >
                <el-radio-group
                  v-model="secretNameSpace"
                  size="small"
                  class="secretNameSpace-class"
                >
                  <el-radio label="1">指定命名空间</el-radio>
                  <el-radio label="2"
                    >存量所有命名空间 (不包括 kube-system、 kube-public
                    和后续的增量命名空间)</el-radio
                  >
                </el-radio-group>
                <!--                <div style="float: right; cursor: pointer" @click="deleteContainer(index)">-->
                <!--                  <el-icon><Delete /></el-icon>-->
                <!--                </div>-->
                <!--                <el-col class="deploy-pixiu-column"-->
                <!--                  >容器名称-->
                <!--                  <el-input-->
                <!--                    v-model="item.name"-->
                <!--                    class="deploy-pixiu-incard"-->
                <!--                    style="margin-left: 30px"-->
                <!--                  />-->
                <!--                </el-col>-->

                <!--                <el-col style="margin-top: 10px" class="deploy-pixiu-column"-->
                <!--                  >镜像-->
                <!--                  <el-input-->
                <!--                    v-model="item.image"-->
                <!--                    style="margin-left: 56px"-->
                <!--                    class="deploy-pixiu-incard"-->
                <!--                  />-->
                <!--                </el-col>-->

                <!--                <el-col style="margin-top: 10px" class="deploy-pixiu-column"-->
                <!--                  >拉取策略-->
                <!--                  <el-radio-group v-model="item.imagePullPolicy" style="margin-left: 30px">-->
                <!--                    <el-radio label="IfNotPresent" border>IfNotPresent</el-radio>-->
                <!--                    <el-radio label="Always" border>Always</el-radio>-->
                <!--                    <el-radio label="Never" border>Never</el-radio>-->
                <!--                  </el-radio-group>-->
                <!--                  <div class="container-line-describe">-->
                <!--                    设置镜像拉取策略，默认使用 IfNotPresent 策略-->
                <!--                  </div>-->
                <!--                </el-col>-->
              </el-card>
            </el-form-item>
            <el-form-item label="内容" style="margin-top: 10px">
              <!-- <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button> -->
              <div class="configmap-label-title" style="margin-left: 5px">变量名</div>
              <div class="configmap-label-title" style="margin-left: 305px">变量值</div>
              <el-divider />
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.configMapLabels"
              :key="index"
              prop="item.key"
              style="margin-top: -20px"
            >
              <div>
                <el-input v-model="item.key" placeholder="变量名" style="width: 300px" />
              </div>
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
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const secretNameSpace = ref(1);

const data = reactive({
  loading: false,
  cluster: '',
  namespaces: [],
  autosize: {
    minRows: 2,
  },

  configMapLabels: [{ key: null, value: null }],
  secretType: '',
  secretNameSpace: '',
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
  'metadata.name': [{ required: true, message: '请输入 Secret 名称', trigger: 'blur' }],
  'item.key': [{ required: true, message: 'key 不能为空', trigger: 'blur' }],
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
            `/proxy/pixiu/${data.cluster}/api/v1/namespaces/` +
            data.configmapForm.metadata.namespace +
            `/configmaps`,
          data: data.configmapForm,
        });
        proxy.$message.success(`configmap ${data.configmapForm.metadata.name} 创建成功`);
        backToSecret();
      } catch (error) {}
    }
  });
};

const cancelCreate = () => {
  backToSecret();
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;

  data.path = proxy.$route.fullPath;

  data.configmapForm.metadata.namespace = proxy.$route.query.namespace;
  getNamespaceList();
});

const changeNamespace = async (val) => {
  data.configmapForm.metadata.namespace = val;
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cluster + '/api/v1/namespaces',
    });

    data.namespaces = [];
    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
};

// 回到 configmap 页面
const backToSecret = () => {
  proxy.$router.push({
    name: 'Secret',
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

.secretNameSpace-class {
  margin: 0 auto;
  width: auto;
  text-align: left;
}
</style>
