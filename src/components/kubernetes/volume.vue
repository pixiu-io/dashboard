<template>
  <div>
    <el-form-item label-width="100px" style="margin-bottom: 0">
      <template #label>
        <el-tooltip
          class="box-item"
          effect="light"
          content="用于挂载到容器中使用"
          placement="top-start"
          raw-content
        >
          数据卷：
        </el-tooltip>
      </template>
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        style="padding-left: 0"
        @click="handleSet"
        >新增</el-button
      >
      <el-button
        v-if="state.show"
        v-show="state.volumeData.length !== 0"
        type="info"
        text
        icon="CaretTop"
        size="small"
        style="margin-left: 20px"
        @click="state.show = !state.show"
        >隐藏</el-button
      >
      <el-button
        v-else
        type="info"
        text
        icon="CaretBottom"
        size="small"
        style="margin-left: 20px"
        @click="state.show = !state.show"
        >展开</el-button
      >
    </el-form-item>
    <el-form-item label-width="100">
      <el-table
        v-show="state.volumeData.length !== 0 && state.show"
        :data="state.volumeData"
        style="width: 100%; font-size: 12px"
        :cell-style="{ padding: '0,5px' }"
        :row-style="{ padding: '2px' }"
        :header-cell-style="{ padding: '5px' }"
        :header-row-style="{ padding: '5px' }"
      >
        <el-table-column prop="" label="类型" width="130">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              size="small"
              @change="(val) => handleTypeChange(val, scope.$index)"
            >
              <el-option
                v-for="item in state.typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="名称" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.name" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="挂载源" width="200">
          <template #default="scope">
            <el-input
              v-if="scope.row.type === 'hostPath' && scope.row.hostPath"
              v-model="scope.row.hostPath.path"
              size="small"
              placeholder="主机路径：/tmp"
            />
            <div v-if="scope.row.type === 'persistentVolumeClaim'" style="display: flex">
              <el-select
                v-model="scope.row.persistentVolumeClaim.claimName"
                size="small"
                :loading="state.loading"
                show-overflow-tooltip
                @click="getPvc"
              >
                <el-option
                  v-for="item in state.pvcdata"
                  :key="item.metadata.uid"
                  :label="item.metadata.name"
                  :value="item.metadata.name"
                />
              </el-select>
            </div>
            <div v-if="scope.row.type === 'configMap'" style="display: flex">
              <el-select
                v-model="scope.row.configMap.name"
                size="small"
                :loading="state.loading"
                show-overflow-tooltip
                @click="getConfigMap()"
              >
                <el-option
                  v-for="item in state.configMapData"
                  :key="item.metadata.name"
                  :label="item.metadata.name"
                  :value="item.metadata.name"
                />
              </el-select>
              <el-button
                text
                type="primary"
                size="small"
                style="margin-left: 3px"
                @click="openDialog(scope.row, scope.$index)"
              >
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <div
                      v-for="(item, index) in scope.row.configMap.items"
                      :key="index"
                      style="display: flex; justify-content: space-between; width: 280px"
                    >
                      <span>Key : {{ item.key }}</span>
                      <span>Path: {{ item.path }}</span>
                    </div>
                  </template>
                  高级
                </el-tooltip>
              </el-button>
            </div>
            <div v-if="scope.row.type === 'secret'" style="display: flex">
              <el-select
                v-model="scope.row.secret.secretName"
                size="small"
                :loading="state.loading"
                show-overflow-tooltip
                @click="getSecret"
              >
                <el-option
                  v-for="item in state.secretData"
                  :key="item.metadata.name"
                  :label="item.metadata.name"
                  :value="item.metadata.name"
                />
              </el-select>
              <el-button
                text
                type="primary"
                size="small"
                style="margin-left: 3px"
                @click="openDialog(scope.row, scope.$index)"
              >
                <el-tooltip placement="top" effect="dark">
                  <template #content>
                    <div
                      v-for="(item, index) in scope.row.secret.items"
                      :key="index"
                      style="display: flex; justify-content: space-between; width: 280px"
                    >
                      <span>Key : {{ item.key }}</span>
                      <span>Path: {{ item.path }}</span>
                    </div>
                  </template>
                  高级
                </el-tooltip>
              </el-button>
            </div>
            <span v-if="scope.row.type === 'tmp'">临时目录</span>
          </template>
        </el-table-column>
        <el-table-column prop="mountPath" label="容器挂载路径" width="150">
          <template #default="scope">
            <el-input
              v-model="scope.row.volumeMountData.mountPath"
              size="small"
              placeholder="容器路径：/app"
            />
          </template>
        </el-table-column>
        <el-table-column prop="subPath" label="容器子路径" width="120">
          <template #default="scope">
            <el-input
              v-model="scope.row.volumeMountData.subPath"
              size="small"
              placeholder="默认为空"
            />
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button
              icon="RemoveFilled"
              type="danger"
              size="small"
              text
              @click="state.volumeData.splice(scope.$index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-dialog
      v-if="dialogFormVisible"
      ref="dialogRef"
      v-model="dialogFormVisible"
      title="指定键："
      width="400px"
    >
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        style="padding-left: 0"
        @click="addKey"
        >新增</el-button
      >
      <el-table
        :data="state.items"
        size="small"
        style="width: 100%; font-size: 10px"
        :cell-style="{ padding: '0,5px' }"
        :row-style="{ padding: '2px' }"
        :header-cell-style="{ padding: '5px' }"
        :header-row-style="{ padding: '5px' }"
      >
        <el-table-column label="键名">
          <template #default="scope">
            <el-select v-model="scope.row.key" placeholder="选择key" size="small">
              <el-option
                v-for="(item, key, index) in state.keyValData"
                :key="index"
                :value="key"
                :label="key"
              >
                {{ key }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="挂载路径">
          <template #default="scope">
            <el-input
              v-model="scope.row.path"
              autocomplete="off"
              size="small"
              placeholder="请使用相对路径：tmp"
            />
          </template>
        </el-table-column>
        <el-table-column width="30">
          <template #default="scope">
            <el-button
              icon="RemoveFilled"
              type="danger"
              size="small"
              text
              @click="state.items.splice(scope.$index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="handleClose">Cancel</el-button>
          <el-button type="primary" size="small" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import jsPlumb from 'jsplumb';
import { getConfigmapList } from '@/services/kubernetes/configmapService';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getSecretList } from '@/services/kubernetes/secretService';
import { isObjectValueEqual } from '@/utils/utils';

const { proxy } = getCurrentInstance();
const uuid = jsPlumb.jsPlumbUtil.uuid;
const dialogFormVisible = ref(false);
const dialogRef = ref();

const state = reactive({
  cluster: '',
  namespace: '',
  loadFromParent: false,
  tmpData: {},
  index: 0,
  keyValData: {},
  set: false,
  show: true,
  typeList: [
    {
      label: '主机目录',
      value: 'hostPath',
    },
    {
      label: '加密字典',
      value: 'secret',
    },
    {
      label: '配置项',
      value: 'configMap',
    },
    {
      label: '临时目录',
      value: 'tmp',
    },
    {
      label: 'PVC',
      value: 'persistentVolumeClaim',
    },
  ],
  volumeData: [],
  pvcdata: [],
  tmpVolumes: [],
  volumes: [],
  volumeMount: [],
  configMapData: [],
  loading: false,
  secretData: [],
  form: {
    key: '',
    path: '',
  },
  items: [],
});

const addKey = () => {
  state.items.push({
    key: '',
    path: '',
  });
};

// 从接口获取configMap数据
const getConfigMap = async () => {
  const [result, err] = await getConfigmapList(state.cluster, state.namespace);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  state.configMapData = result.items;
};

// 从接口获取secret数据
const getSecret = async () => {
  const [result, err] = await getSecretList(state.cluster, state.namespace);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  state.secretData = result.items;
};
// 从接口获取pvc数据
const getPvc = async () => {};
// 打开dialog,并处理初始化选项
const openDialog = (config, index) => {
  if (config.type === 'configMap') {
    if (config.configMap.items !== undefined) {
      state.items = config.configMap.items;
    }
    dialogFormVisible.value = true;
    if (dialogFormVisible.value) {
      state.configMapData.forEach((item) => {
        if (item.metadata.name === config.configMap.name) {
          state.keyValData = item.data;
        }
      });
      state.index = index;
      state.tmpData = config;
    }
  } else if (config.type === 'secret') {
    if (config.secret.items !== undefined) {
      state.items = config.secret.items;
    }
    dialogFormVisible.value = true;
    if (dialogFormVisible.value) {
      state.secretData.forEach((item) => {
        if (item.metadata.name === config.secret.secretName) {
          state.keyValData = item.data;
        }
      });
      state.index = index;
      state.tmpData = config;
    }
  }
};
// 关闭dialog
const handleClose = () => {
  dialogFormVisible.value = false;
  //置空数据
  state.tmpData = {};
  state.index = 0;
  state.items = [];
};
// 确认指定特定的键值
const handleConfirm = () => {
  if (state.tmpData.type === 'configMap') {
    state.volumeData[state.index].configMap.items = state.items;
  } else if (state.tmpData.type === 'secret') {
    state.volumeData[state.index].secret.items = state.items;
  }
  handleClose();
};

// 转换volumeData 为k8s所需类型的数据
const handleVolumeData = () => {
  const tmpVolume = [];
  const tempVolumeMount = [];

  state.volumeData.forEach((item, index) => {
    if (tempVolumeMount.length === index) {
      tempVolumeMount.push({});
    }
    tempVolumeMount[index].name = item.name;
    tempVolumeMount[index].mountPath = item.volumeMountData.mountPath;
    tempVolumeMount[index].subPath = item.volumeMountData.subPath;
    let flag = false;
    if (tmpVolume.length > 0) {
      tmpVolume.filter((i) => {
        if (i.name === item.name) {
          flag = true;
          return;
        }
      });
    }
    if (!flag) {
      let volume = {
        name: item.name,
      };
      switch (item.type) {
        case 'configMap':
          volume.configMap = item.configMap;
          break;
        case 'secret':
          volume.secret = item.secret;
          break;
        case 'hostPath':
          volume.hostPath = item.hostPath;
          break;
        case 'persistentVolumeClaim':
          volume.persistentVolumeClaim = item.persistentVolumeClaim;
          break;
        case 'tmp':
          volume.emptyDir = item.emptyDir;
          break;
      }
      tmpVolume.push(volume);
    }
  });
  state.volumeMount = tempVolumeMount;
  state.tmpVolumes = tmpVolume;
  state.volumes = tmpVolume;
};

// 添加volumeData数据
const handleSet = () => {
  const name = 'volume-' + uuid().toString().split('-')[1];
  state.volumeData.push({
    type: 'hostPath',
    name: name,
    hostPath: {
      path: '',
    },
    volumeMountData: {
      name: name,
      mountPath: '',
    },
  });
};

// 根据不同的type初始化volumeData的值
const handleTypeChange = (type, index) => {
  // 切换type类型时初始化不同的值
  switch (type) {
    case 'hostPth':
      state.volumeData[index].hostPath = {
        path: '',
      };
      break;
    case 'secret':
      state.volumeData[index].secret = {};
      break;
    case 'configMap':
      state.volumeData[index].configMap = {};
      break;
    case 'tmp':
      state.volumeData[index].emptyDir = {};
      break;
    case 'persistentVolumeClaim':
      state.volumeData[index].persistentVolumeClaim = {
        claimName: '',
      };
      break;
  }
};

//接受父组件传递的值
const props = defineProps({
  volumeMounts: {
    type: Array,
    required: true,
  },
  volumes: {
    type: Array,
    required: true,
  },
});

//解析volumeMount为所需要的CreateK8SVolumeData 类型
const parseVolumeMount = (volumeMount) => {
  const tmpVolumeData = [];
  volumeMount.forEach((item) => {
    state.tmpVolumes.forEach((v) => {
      let volumeType = '';

      if (v.hostPath) {
        volumeType = 'hostPath';
      }
      if (v.secret) {
        volumeType = 'secret';
        getSecret();
      }
      if (v.configMap) {
        volumeType = 'configMap';
        getConfigMap();
      }
      if (v.emptyDir) {
        volumeType = 'tmp';
      }
      if (v.persistentVolumeClaim) {
        volumeType = 'persistentVolumeClaim';
        getPvc();
      }

      if (item.name === v.name) {
        tmpVolumeData.push({
          name: item.name,
          type: volumeType,
          emptyDir: v.emptyDir,
          secret: v.secret,
          configMap: v.configMap,
          persistentVolumeClaim: v.persistentVolumeClaim,
          hostPath: v.hostPath,
          volumeMountData: {
            name: item.name,
            mountPath: item.mountPath,
            subPath: item.subPath,
          },
        });
      }
    });
  });
  state.volumeData = tmpVolumeData;
};

onMounted(() => {
  state.cluster = proxy.$route.query.cluster;
  state.cloud = proxy.$route.query;
  state.namespace = getLocalNamespace();

  if (!isObjectValueEqual(props.volumes, state.volumes) && props.volumes) {
    state.tmpVolumes = props.volumes;
  }

  if (props.volumeMounts && Object.keys(props.volumeMounts).length > 0) {
    parseVolumeMount(props.volumeMounts);
  }
});

const getVolumeMounts = () => {
  handleVolumeData();
  return state.volumeMount;
};

const getVolumes = () => {
  return state.volumes;
};
defineExpose({
  getVolumeMounts,
  getVolumes,
});
</script>

<style scoped></style>
