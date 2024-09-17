<template>
  <div style="margin-left: 3%">
    <div>
      <el-tabs v-model="editableTabsValue" :before-leave="tabChange" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="(item, index) in state.containers"
          :key="index"
          :name="index"
          :closable="state.containers.length != 1"
        >
          <template #label>
            <span class="custom-tabs-label">
              {{ item.isInitContainer ? 'init容器' : '容器' }}
            </span>
          </template>
          <ContainerDiv
            :ref="(el) => setItemRef(el, index)"
            :container="item"
            :volumes="props.volumes"
          />
        </el-tab-pane>
        <el-tab-pane key="CustomBtn" name="CustomBtn" :closable="false">
          <template #label>
            <el-link type="primary" :underline="false" :icon="Plus">添加容器</el-link>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, onMounted, getCurrentInstance } from 'vue';
import { Plus } from '@element-plus/icons-vue';
const ContainerDiv = defineAsyncComponent(() => import('./container.vue'));
const editableTabsValue = ref(0);
const itemRefs = ref([]);
const { proxy } = getCurrentInstance();

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el;
  }
};
const tabChange = (currentName) => {
  if (currentName === 'CustomBtn') {
    tabAdd();
    return false;
  }
};

const tabAdd = async () => {
  const [containers, initContainers, volumes, containerVerified] = await getContainers();
  if (!containerVerified) {
    proxy.$message.error('请正确填写字段');
    return;
  }
  const newTabName = state.containers.length;
  state.containers.push(container);
  editableTabsValue.value = newTabName;
};

const tabRemove = (tabPaneName) => {
  if (state.containers.length <= 1) {
    return false;
  }
  const tabs = state.containers;
  state.containers = tabs.filter((_tab, index) => index !== tabPaneName);
  editableTabsValue.value = state.containers.length - 1;
};

const state = reactive({
  verified: true,
  currentIndex: 1,
  addIndex: 1,
  tabIndex: 1,
  editableTabsValue: '1',
  volumes: [],
  containers: [
    {
      isInitContainer: false,
      name: '',
      image: '',
      imagePullPolicy: 'IfNotPresent',
      securityContext: {
        privileged: false,
      },
      stdin: false,
      tty: false,
      env: [],
      ports: [],
      livenessProbe: {},
      startupProbe: {},
      readinessProbe: {},
      lifecycle: {
        postStart: {},
        preStop: {},
      },
      command: [],
      args: [],
      volumeMounts: [],
    },
  ],
});
const container = {
  isInitContainer: false,
  name: '',
  image: '',
  imagePullPolicy: 'IfNotPresent',
  securityContext: {
    privileged: false,
  },
  env: [],
  ports: [],
  livenessProbe: {},
  startupProbe: {},
  readinessProbe: {},
  lifecycle: {
    postStart: {},
    preStop: {},
  },
  command: [],
  args: [],
  volumeMounts: [],
};
const props = defineProps({
  volumes: {
    type: Array,
    required: true,
  },
  containers: {
    type: Array,
    required: true,
  },
  initContainers: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const getContainer = async () => {
  state.verified = true;
  const containers = state.containers;
  const vs = [];
  //遍历itemRefs
  for (let index = 0; index < itemRefs.value.length; index++) {
    if (!itemRefs.value[index]) continue;
    const [container, volumes, verified] = await itemRefs.value[index].getContainer();
    if (state.verified && !verified) {
      state.verified = false;
    }
    containers[index] = { ...container };
    vs.push(...volumes);
  }
  state.volumes = vs;
};

const getContainers = async () => {
  await getContainer();
  let containers = [];
  let initContainers = [];

  let i = 0;
  while (i < state.containers.length) {
    const c = state.containers[i];
    if (c.isInitContainer) {
      delete c.isInitContainer;
      initContainers.push(c);
    } else {
      delete c.isInitContainer;
      containers.push(c);
    }
    i++;
  }
  return [containers, initContainers, state.volumes, state.verified];
};
defineExpose({
  getContainers,
});

onMounted(() => {
  let containers = [];
  if (props.initContainers.length > 0) {
    const tmp = JSON.parse(JSON.stringify(props.initContainers));
    tmp.forEach((item) => {
      item.isInitContainer = true;
    });
    containers.push(...tmp);
  }
  if (props.containers.length > 0) {
    const tmp = JSON.parse(JSON.stringify(props.containers));
    tmp.forEach((item) => {
      item.isInitContainer = false;
    });
    containers.push(...tmp);
  }
  state.containers = containers;
  if (props.volumes.length > 0) {
    state.volumes = JSON.parse(JSON.stringify(props.volumes));
  }
});
</script>

<style scoped></style>
