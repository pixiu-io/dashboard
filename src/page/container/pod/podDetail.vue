<template>
  <div style="display: flex">
    <pixiu-icon
      name="icon-back"
      style="cursor: pointer"
      size="16px"
      type="iconfont"
      color="#006eff"
      @click="goToPod"
    />

    <div style="size: 14px; margin-left: 20px; margin-top: -4px">
      {{ data.name }}({{ data.namespace }})
    </div>
  </div>

  <el-card class="contend-card-container2">
    <el-col>
      <div style="float: right; height: 50px">
        <button class="pixiu-two-button" @click="GetPod">刷新</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">监控</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">日志</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">删除</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">查看YAML</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">远程登陆</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
          更多操作
        </button>
      </div>
    </el-col>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器管理" name="second"> </el-tab-pane>
      <el-tab-pane label="元数据" name="third"> </el-tab-pane>
      <el-tab-pane label="监控指标" name="four"></el-tab-pane>
      <el-tab-pane label="环境变量" name="five"></el-tab-pane>
      <el-tab-pane label="事件" name="six"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <div style="width: 50%">
        <el-form style="margin-top: 10px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >实例信息
              </span>
            </template>
          </el-form-item>
          <el-form-item style="margin-top: -10px">
            <template #label>
              <span class="detail-card-key-style">名称 </span>
            </template>
            <span class="detail-card-value-style" style="margin-left: 76px">
              {{ data.pod.metadata.name }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">命名空间 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.metadata.namespace }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">QoS类别 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.status.qosClass }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">所在节点 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.spec.nodeName }}: {{ data.pod.status.hostIP }}
            </span>
          </el-form-item>
          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">容器地址 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.status.podIP }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">运行状态 </span>
            </template>
            <span class="detail-card-value-style"> Running </span>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >标签
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.pod.metadata.labels === undefined">-</div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.labels"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >注释
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.pod.metadata.annotations === undefined">-</div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.annotations"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="data.activeName === 'second'">second</div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',

  pod: {
    metadata: {},
    spec: {},
    status: {},
  },

  activeName: 'first',

  containerMap: {},
  containerStatusMap: {},
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetPod();
});

const GetPod = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.name}`,
    });
    data.pod = res;

    console.log('pod', data.pod);

    data.yaml = jsYaml.dump(data.pod, { quotingType: '"' });
    data.createTime = formatTimestamp(data.pod.metadata.creationTimestamp);

    data.containerMap = {};
    for (let c of data.pod.spec.containers) {
      data.containerMap[c.name] = c;
    }
    data.containerStatusMap = {};
    for (let cs of data.pod.status.containerStatuses) {
      data.containerStatusMap[cs.name] = cs;
    }
  } catch (error) {}
};

const goToPod = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/pods', query: queryParams });
};
</script>
