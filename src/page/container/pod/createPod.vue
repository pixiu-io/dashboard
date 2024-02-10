<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <pixiu-card back="true" title="新建标准集群" height="50px" />
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 10px; width: 75%; border-radius: 0px">
          <el-form
            ref="ruleFormRef"
            :label-position="labelPosition"
            label-width="120px"
            :model="data.clusterForm"
            :rules="rules"
            status-icon
            require-asterisk-position="right"
            style="margin-left: 2%"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="集群名称" prop="alias_name" style="width: 50%">
              <el-input v-model="data.clusterForm.alias_name" placeholder="请输入集群名称" />
            </el-form-item>

            <div style="margin-top: 30px" />
            <el-form-item label="所在地域" style="width: 100%">
              <el-radio-group v-model="data.clusterForm.region">
                <el-radio-button
                  v-for="(item, index) in data.regionOptions"
                  :key="index"
                  :label="item.label"
                />
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -6px">
              处在不同地域的云产品内网不通，导入后无法更换。建议选择合适的地域，以提高使用体验。
            </div>

            <div style="margin-top: 20px" />
            <el-form-item label="KubeConfig">
              <el-upload
                drag
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :limit="1"
                :auto-upload="false"
              >
                <el-icon class="el-icon--upload" style="height: 40px">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">
                  将 kubeconfig 拖到此处，或
                  <em style="color: #006eff">点击上传</em>
                </div>
              </el-upload>
            </el-form-item>

            <!-- <div style="margin-top: 20px" />
              <el-form-item label="高性能 eventer">
                <el-switch
                  v-model="data.clusterForm.enable_pixiu_eventer"
                  active-text="启用"
                  inactive-text="关闭"
                />
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                启用 pixiu-eventer 组件，提供高性能的 kubernetes 事件查询能力
              </div> -->

            <div style="margin-top: 18px" />
            <el-form-item label="集群删除保护">
              <el-switch
                v-model="data.clusterForm.protected"
                inline-prompt
                width="48px"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              开启集群删除保护时，不允许进行删除集群操作
              <!-- 在 kubernetes 集群中创建 pixiu-system  命名空间，用于运行 pixiu 的系统组件和配置 -->
            </div>

            <div style="margin-top: 20px" />
            <el-form-item label="集群描述" style="width: 70%">
              <el-input
                v-model="data.clusterForm.description"
                placeholder="请输入 Kubernentes 集群描述"
                type="textarea"
                :autosize="data.autosize"
              />
            </el-form-item>

            <div style="margin-top: 35px" />
            <el-form-item>
              <el-button class="pixiu-cancel-button" @click="connectKubernetes()">Test</el-button>

              <el-button
                style="margin-left: 15%"
                class="pixiu-confirm-button"
                type="primary"
                :disabled="data.allowCreated"
                @click="comfirmCreate()"
                >确定</el-button
              >
              <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const rules = {
  alias_name: [{ required: true, message: '请输入集群名称', trigger: 'blur' }],
};

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  clusterForm: {
    alias_name: '',
    kube_config: '', // k8s 集群 kubeconfig 文件的 base64 格式
    region: '无锡',
    protected: true,
    description: '',
    enable_pixiu_eventer: false, // 启用高性能事件收集器
  },

  allowCreated: true, // 仅在前端生效

  // 后续从后端获取
  regionOptions: [
    {
      value: '无锡',
      label: '无锡',
    },
    {
      value: '宿迁',
      label: '宿迁',
    },
    {
      value: '杭州',
      label: '杭州',
    },
    {
      value: '泗阳',
      label: '泗阳',
    },
    {
      value: '苏州',
      label: '苏州',
    },
    {
      value: '南京',
      label: '南京',
    },
    {
      value: '上海',
      label: '上海',
    },
    {
      value: '北京',
      label: '北京',
    },
  ],
});

const labelPosition = ref('left');

const comfirmCreate = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (data.clusterForm.kube_config.trim().length === 0) {
        return proxy.$message.error('未发现 Kubeconfig 文件，请完成上传后再进行操作');
      }

      try {
        const resp = await proxy.$http({
          method: 'post',
          url: '/pixiu/clusters',
          data: data.clusterForm,
        });
        proxy.$message.success(`Kubernetes 集群 ${data.clusterForm.alias_name} 创建成功`);
        backToContainer();
      } catch (error) {}
    }
  });
};

const cancelCreate = () => {
  backToContainer();
};

const connectKubernetes = async () => {
  if (data.clusterForm.kube_config.trim().length === 0) {
    return proxy.$message.error('未发现 Kubeconfig 文件，请完成上传后再进行操作');
  }

  try {
    const resp = await proxy.$http({
      method: 'post',
      url: '/pixiu/clusters/ping',
      data: {
        kube_config: data.clusterForm.kube_config,
      },
    });

    data.allowCreated = false;
    proxy.$message.success('kubernetes 集群连接正常');
  } catch (error) {}
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: 'Container',
  });
};

const handleChange = (file, files) => {
  const reader = new FileReader();
  reader.onload = () => {
    const contents = reader.result;
    data.clusterForm.kube_config = btoa(contents);
  };

  reader.readAsBinaryString(file.raw);
};

const beforeRemove = (file, files) => proxy.$confirm(`确定移除 ${file.name}？`);

const handleRemove = (file, files) => {
  data.clusterForm.kube_config = '';
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
