<template>
  <el-card class="detail-card-container">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px">刷新</button>
    </div>

    <div style="display: flex; margin-left: 20px; margin-top: 15px">
      <pixiu-icon name="icon-config" size="40px" type="iconfont" color="#006eff" />
      <div
        class="breadcrumb-create-style"
        style="margin-left: 10px; margin-top: 10px; font-size: 15px"
      >
        {{ data.name }}
        <pixiu-icon
          name="icon-copy"
          size="12px"
          style="cursor: pointer; margin-left: 2px"
          type="iconfont"
          color="#909399"
          @click="copy(data.name)"
        />
      </div>
    </div>

    <div style="margin-top: 25px; display: flex">
      <div style="width: 50%">
        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">Secret名称</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 94px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">类型</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 132px">
              <el-tag>{{ data.secret.type }} </el-tag>
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">Data</span>
            </template>
          </el-form-item>
        </el-form>
      </div>

      <div style="width: 50%">
        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">命名空间</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 106px">
              {{ data.namespace }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">创建时间</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 106px">
              {{ data.time }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">描述</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 132px"> - </span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp, copy } from '@/utils/utils';
import { updateSecret, getSecret } from '@/services/kubernetes/secretService';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  clusterName: '',
  namespace: '',
  secret: '',
  name: '',

  time: '',
  activeName: 'first',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;

  data.yamlName = proxy.$route.query.name;
  data.clusterName = localStorage.getItem(data.cluster);

  data.name = proxy.$route.query.name;

  getSecretByName();
});

const getSecretByName = async () => {
  const [result, err] = await getSecret(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.secret = result;

  data.time = formatTimestamp(result.metadata.creationTimestamp);
  data.yaml = jsYaml.dump(result, { quotingType: '"' });
};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const goToSecret = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/secrets', query: queryParams });
};

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.secret-info {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.secret-detail-info {
  font-size: 13px;
  color: #29232b;
}
</style>
