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
            <span v-if="item.isInitContainer" class="custom-tabs-label">
              {{ ' init容器 ' }}
            </span>
            <span v-else class="custom-tabs-label">
              {{ ' 容器 ' }}
            </span>
          </template>
          <Container
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
import { ref, reactive, defineAsyncComponent, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
const Container = defineAsyncComponent(() => import('./container.vue'));
const editableTabsValue = ref(0);
const itemRefs = ref([]);

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

const tabAdd = () => {
  const newTabName = state.containers.length;
  state.containers.push(state.container);
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
  loadFromParent: false,
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
      lifecycle: {
        postStart: {},
        preStop: {},
      },
    },
  ],
  container: {
    isInitContainer: false,
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
    securityContext: {
      privileged: false,
    },
    lifecycle: {
      postStart: {},
      preStop: {},
    },
  },
});

const props = defineProps({
  volumes: {
    type: Array,
    required: true,
  },
  containers: {
    type: Array,
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
    state.verified = verified;
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
  if (props.containers) {
    state.containers = JSON.parse(JSON.stringify(props.containers));
  }
  if (props.volumes) {
    state.volumes = JSON.parse(JSON.stringify(props.volumes));
  }
});
</script>

<style scoped></style>
