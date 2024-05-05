<template>ddd</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getNode } from '@/services/kubernetes/nodeService';
import { getPodsByNode } from '@/services/kubernetes/podService';
import { getTableData } from '@/utils/utils';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { getRawEventList, deleteEvent } from '@/services/kubernetes/eventService';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  name: '',
  clusterName: '',
  cluster: '',

  pageInfo: {
    page: 1,
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  pageEventInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  nodeObject: '',

  crontab: false,
  nodePods: [],
  nodeEvents: [],

  nodeImages: [],

  tableData: [],
  eventTableData: [],

  activeName: 'second',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  await getNodeObject();

  getNodePods();
  getNodeEvents();
});

const getNodeObject = async () => {
  data.loading = true;
  const [result, err] = await getNode(data.cluster, data.name);
  data.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodeObject = result;
  data.yaml = jsYaml.dump(data.nodeObject, { quotingType: '"' });

  if (data.nodeObject.status.images !== undefined) {
    for (let image of data.nodeObject.status.images) {
    }
  }
};

const formatterName = (row, column, cellValue) => {
  return (
    <el-tooltip effect="light" placement="top" content={cellValue}>
      <div class="pixiu-ellipsis-style">{cellValue}</div>
    </el-tooltip>
  );
};

const getNodePods = async () => {
  const [result, err] = await getPodsByNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodePods = result.items;
  data.pageInfo.total = result.items.length;
  data.tableData = getTableData(data.pageInfo, data.nodePods);
};

const searchPods = async () => {
  let allSearchedPods = [];
  if (data.pageInfo.search.field === 'name') {
    for (let pod of data.nodePods) {
      if (pod.metadata.name.search(data.pageInfo.search.searchInfo) !== -1) {
        allSearchedPods.push(pod);
      }
    }
  }

  data.pageInfo.total = allSearchedPods.length;
  data.tableData = getTableData(data.pageInfo, allSearchedPods);
};

const getNodeEvents = async () => {
  data.loading = true;
  const [result, err] = await getRawEventList(
    data.cluster,
    data.nodeObject.metadata.name,
    '',
    data.nodeObject.metadata.name,
    'Node',
    false,
  );
  data.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }

  data.nodeEvents = result;
  data.pageEventInfo.total = result.length;
  data.eventTableData = getTableData(data.pageEventInfo, data.nodeEvents);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  data.tableData = getTableData(data.pageInfo, data.nodePods);
};

const onEventChange = (v) => {
  data.pageEventInfo.limit = v.limit;
  data.pageEventInfo.page = v.page;

  data.eventTableData = getTableData(data.pageEventInfo, data.nodeEvents);
};

const formatterStatus = (row, column, cellValue) => {
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    return <div class="color-yellow-word">{phase}</div>;
  }

  if (phase == 'Running') {
    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

const getPodRestartCount = (row, column, status) => {
  let count = 0;
  // status.containerStatuses.forEach((item) => {
  //   count += item.restartCount;
  // });
  return <div>{count} 次</div>;
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const editYaml = () => {
  data.readOnly = false;
};

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};
</script>

<style scoped="scoped"></style>
