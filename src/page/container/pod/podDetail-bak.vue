<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToPod"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>

        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Pod:{{ data.name }}({{ data.namespace }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="GetPod">刷新</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">删除</button>
      </el-col>
    </el-row>
  </div>

  <el-card class="contend-card-container2">
    <div v-if="data.pod" style="width: 100%; border-radius: 0px">
      <el-descriptions
        style="margin-left: 8px"
        class="margin-top"
        title="基本信息"
        :column="3"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">名称</div>
          </template>
          {{ data.pod.metadata.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">命名空间</div>
          </template>
          <div style="color: 000000e6">{{ data.pod.metadata.namespace }}</div>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">QoS类别</div>
          </template>
          {{ data.pod.status.qosClass }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">所在节点</div>
          </template>
          {{ data.pod.spec.nodeName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">实例IP</div>
          </template>
          {{ data.pod.status.podIP }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">状态</div>
          </template>
          Running
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">创建时间</div>
          </template>
          {{ data.createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      style="margin-top: 12px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="容器" name="first"> </el-tab-pane>
      <el-tab-pane label="元数据" name="second"> </el-tab-pane>
      <el-tab-pane label="环境变量" name="third"> </el-tab-pane>
      <el-tab-pane label="日志" name="four"></el-tab-pane>
      <el-tab-pane label="事件" name="five"></el-tab-pane>
      <el-tab-pane label="YAML" name="six"></el-tab-pane>
    </el-tabs>
  </el-card>

  <div v-if="data.activeName === 'first'">
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <button class="pixiu-two-button3">容器列表</button>

          <el-input
            v-model="data.pageInfo.query"
            placeholder="名称搜索关键字"
            style="width: 480px; float: right"
            clearable
            @clear="getDeploymentPods"
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="getDeploymentPods"
              />
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <el-card class="contend-card-container2">
      <el-table
        v-loading="data.loading"
        :data="data.pod.spec.containers"
        stripe
        style="margin-top: 4px; width: 100%; margin-bottom: 25px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="name" label="容器名称" />
        <el-table-column prop="name" label="镜像" :formatter="formatterImage" min-width="110px" />

        <el-table-column prop="type" label="状态"> Running</el-table-column>

        <el-table-column prop="name" label="启动时间" :formatter="formatterStartedTime" />
        <el-table-column prop="name" label="CPU资源" :formatter="formatterCPUResource" />
        <el-table-column prop="name" label="内存资源" :formatter="formatterMemoryResource" />
        <el-table-column prop="name" label="重启次数" :formatter="formatterRestartCount" />

        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
            >
              远程连接
            </el-button>
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: 10px; color: #006eff"
              @click="shell(scope.row)"
            >
              日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <div v-if="data.activeName === 'second'">
    <div style="margin-top: 14px">标签</div>
    <el-card class="contend-card-container3">
      <div v-if="data.pod.metadata.labels === undefined">-</div>
      <div v-else style="margin-top: -8px">
        <div v-for="(item, index) in data.pod.metadata.labels" :key="item" style="font-size: 14px">
          <el-tag type="info" style="margin-top: 5px">{{ index }}: {{ item }}</el-tag>
        </div>
      </div>
    </el-card>

    <div style="margin-top: 14px">注解</div>
    <el-card class="contend-card-container3">
      <div v-if="data.pod.metadata.annotations === undefined">-</div>
      <div v-else style="margin-top: -8px">
        <div
          v-for="(item, index) in data.pod.metadata.annotations"
          :key="item"
          style="font-size: 14px"
        >
          <el-tag type="info" style="margin-top: 5px">{{ index }}: {{ item }}</el-tag>
        </div>
      </div></el-card
    >
  </div>

  <div v-if="data.activeName === 'third'">
    <div style="margin-top: 14px">环境变量</div>
    <el-card class="contend-card-container3">
      <div>-</div>
    </el-card>
  </div>

  <div v-if="data.activeName === 'four'">
    <button style="margin-top: 15px; width: 85px" class="pixiu-two-button" @click="getPodLog">
      日志刷新
    </button>

    <div style="margin-top: 15px">
      <el-card class="contend-card-container2">
        <div style="background-color: #29232b; color: white; min-height: 400px">
          <div style="margin-left: 20px">
            <div v-if="data.podLogs.length === 0" style="font-size: 14px">暂无日志</div>
            <div v-else>
              <div v-for="(item, index) in data.podLogs" :key="item" style="font-size: 14px">
                {{ index + 1 }} <span style="margin-left: 18px"></span> {{ item }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'five'">
    <el-col>
      <button
        style="margin-top: 15px; width: 85px"
        class="pixiu-two-button"
        @click="getDeploymentEvents"
      >
        事件刷新
      </button>
      <button style="margin-top: 15px; margin-left: 10px; width: 85px" class="pixiu-two-button2">
        批量删除
      </button>

      <div style="float: right; margin-top: 16px">
        <el-switch v-model="data.eventAutoRefresh" inline-prompt width="36px" /><span
          style="font-size: 13px; margin-left: 5px; margin-right: 10px"
          >自动刷新</span
        >
      </div>
    </el-col>

    <el-card class="contend-card-container2">
      <el-table
        v-loading="data.loading"
        :data="data.deploymentEvents"
        stripe
        style="margin-top: 10px; width: 100%; margin-bottom: 25px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="kind" label="资源类型"> </el-table-column>
        <el-table-column prop="objectName" label="资源名称"> </el-table-column>
        <el-table-column prop="message" label="内容" width="500ox" />

        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="deleteEvent(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <div v-if="data.activeName === 'six'">
    <div style="margin-top: 20px">
      <el-col>
        <button class="pixiu-two-button" style="width: 85px" @click="editYaml">编辑YAML</button>
        <button class="pixiu-two-button" style="margin-left: 10px" @click="copyYmal">复制</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="GetPod"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 10px"></div>

    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly" :height="400"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
    </div>
  </div>
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

  pod: '',
  podLogs: [],

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  activeName: 'five',

  yaml: '',
  yamlName: '',
  readOnly: true,

  card: true,

  containerMap: {},
  containerStatusMap: {},
  createTime: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  await GetPod();
});

const { toClipboard } = useClipboard();
const copyYmal = async () => {
  try {
    await toClipboard(data.yaml);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const GetPod = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.name}`,
    });
    data.pod = res;
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

    initItems();
  } catch (error) {}
};

const initItems = () => {};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};

const formatterRestartCount = (row, column, cellValue) => {
  let rc = '-';
  const cs = data.containerStatusMap[cellValue];
  if (cs !== undefined) {
    rc = cs.restartCount;
  }

  return <div>{rc} 次</div>;
};

const formatterCPUResource = (row, column, cellValue) => {
  let requests = '-';
  let limits = '-';

  const container = data.containerMap[cellValue];
  if (container !== undefined) {
    if (container.resources.requests !== undefined) {
      if (container.resources.requests.cpu !== undefined) {
        requests = container.resources.requests.cpu;
      }
    }
    if (container.resources.limits !== undefined) {
      if (container.resources.limits.cpu !== undefined) {
        limits = container.resources.limits.cpu;
      }
    }
  }

  return (
    <div style="display:flex;flex-direction:column">
      <el-space>
        <span style="font-size: 12px">requests: </span>
        <span style="font-size: 12px">{requests}</span>
      </el-space>
      <el-space>
        <span style="font-size: 12px">limits: </span>
        <span style="font-size: 12px">{limits}</span>
      </el-space>
    </div>
  );
};

const formatterMemoryResource = (row, column, cellValue) => {
  let requests = '-';
  let limits = '-';

  const container = data.containerMap[cellValue];
  if (container !== undefined) {
    if (container.resources.requests !== undefined) {
      if (container.resources.requests.memory !== undefined) {
        requests = container.resources.requests.memory;
      }
    }
    if (container.resources.limits !== undefined) {
      if (container.resources.limits.memory !== undefined) {
        limits = container.resources.limits.memory;
      }
    }
  }

  return (
    <div style="display:flex;flex-direction:column">
      <el-space>
        <span style="font-size: 12px">requests: </span>
        <span style="font-size: 12px">{requests}</span>
      </el-space>
      <el-space>
        <span style="font-size: 12px">limits: </span>
        <span style="font-size: 12px">{limits}</span>
      </el-space>
    </div>
  );
};

const formatterImage = (row, column, cellValue) => {
  let image = '-';
  let policy = '-';
  const container = data.containerMap[cellValue];
  if (container !== undefined) {
    image = container.image;
    policy = container.imagePullPolicy;
  }

  return (
    <div style="display:flex;flex-direction:column">
      <el-space>
        <span style="font-size: 12px">镜像: </span>
        <span style="font-size: 12px">{image}</span>
      </el-space>
      <el-space>
        <span style="font-size: 12px">策略: </span>
        <span style="font-size: 12px">{policy}</span>
      </el-space>
    </div>
  );
};

const formatterStartedTime = (row, column, cellValue) => {
  const cs = data.containerStatusMap[cellValue];
  if (cs === undefined || !cs.started) {
    return (
      <div class="pixiu-table-formatter">
        <el-space>
          <div>-</div>
        </el-space>
      </div>
    );
  } else {
    const time = formatTimestamp(cs.state.running.startedAt);
    return (
      <el-tooltip effect="light" placement="top" content={time}>
        <div class="pixiu-ellipsis-style">{time}</div>
      </el-tooltip>
    );
  }
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const goToPod = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/pods', query: queryParams });
};

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.namespace-tab {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: -32px;
}

.namespace-detail-info {
  font-size: 13px;
  color: #29232b;
}

.namespace-info {
  font-size: 13px;
  margin-left: 10px;
  color: #29232b;
}
</style>
