<template>
  <Description
    :description="'Ingress 是 Kubernetes 中用来定义 Kubernetes 服务访问的规则的资源。它定义了从集群外部到集群内服务的访问方式，包括协议、端口、路径等。'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createIngress">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getIngresses">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getIngresses"
          @input="getIngresses"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getIngresses"
            />
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.tableData"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        header-row-class-name="pixiu-table-header"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="metadata" label="注解" :formatter="formatterAnno"> </el-table-column> -->
        <el-table-column
          prop="spec.rules"
          label="转发规则"
          min-width="120px"
          :formatter="formatterIngressRules"
        >
        </el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>

        <el-table-column prop="status" label="地址" :formatter="formatterAddress"></el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="editIngress(scope.row)"
            >
              设置
            </el-button>

            <el-button type="text" size="small" style="margin-right: -2px; color: #006eff">
              事件
            </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleEditYamlDialog(scope.row)"
                  >
                    编辑YAML
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleWhiteListDialog(scope.row)"
                  >
                    白名单
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleDeleteDialog(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getIngresses"
  ></PiXiuViewOrEdit>
  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <el-dialog
    :model-value="data.whiteListData.close"
    style="color: #000000; font: 14px"
    width="720px"
    align-center
    center
    @close="cancelWhiteList"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        白名单
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -5px; margin-left: 5px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">补充点 ingress 白名单的文案</div>
    </el-card>

    <el-form-item>
      <template #label>
        <span style="margin-left: 8px; font-size: 13px; color: #191919">启用</span>
      </template>
      <el-switch
        v-model="data.whiteListData.enable"
        style="margin-left: 15px"
        inline-prompt
        @change="changeSwitch"
      />
    </el-form-item>

    <el-form-item v-if="data.whiteListData.enable">
      <template #label>
        <span style="margin-left: 8px; font-size: 13px; color: #191919">放通IP</span>
      </template>
      <div style="width: 80%">
        <div
          v-if="data.whiteListData.editable === true"
          style="display: flex; flex-direction: column; width: 100%"
        >
          <el-input
            ref="ipInput"
            v-model="data.whiteListData.ipList"
            style="margin-left: 5px; width: 90%"
            type="textarea"
            :autosize="data.whiteListData.autosize"
            @keydown.enter="handleEnter"
            @blur="handleInputConfirm"
            @focus="
              vaildator = true;
              errorMessage = '';
              clearStyle();
            "
          />
          <span
            v-if="vaildator === false"
            style="
              color: var(--el-color-danger);
              font-size: 12px;
              line-height: 12px;
              margin-left: 5px;
              margin-top: 2px;
            "
            >{{ errorMessage }}</span
          >
        </div>
        <el-space
          v-else
          style="border: 1px solid #dcdfe6; margin-top: 10px; padding: 5px; width: 80%"
          @click="enableEdit"
        >
          <el-tag
            v-for="(ip, index) in data.whiteListData.allowIps"
            :key="index"
            closable
            @close="handleClose(index)"
            >{{ ip }}</el-tag
          >
        </el-space>
      </div>
    </el-form-item>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelWhiteList">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmWhiteList"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getTableData, searchData } from '@/utils/utils';
import {
  formatterTime,
  formatterIngressRules,
  formatterAddress,
  formatterNamespace,
} from '@/utils/formatter';
import { reactive, getCurrentInstance, onMounted, ref, onUnmounted, nextTick } from 'vue';
import jsYaml from 'js-yaml';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  getIngressList,
  updateIngress,
  getIngress,
  deleteIngress,
  patchIngress,
} from '@/services/kubernetes/ingressService';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Description from '@/components/description/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();
const ipInput = ref(null);
const vaildator = ref(true);
const errorMessage = ref('');

const data = reactive({
  cluster: '',
  clusterName: '',
  namespace: 'default',

  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  loading: false,

  ingressList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Ingress',
    deleteName: '',
  },

  // 白名单数据
  whiteListData: {
    editable: true,
    close: false,
    enable: false,
    allowIps: [],
    ipList: '',
    autosize: {
      minRows: 5,
    },
    namespace: '',
    name: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getIngresses();
});
onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

const changeSwitch = (value) => {
  if (value) {
    vaildator.value = true;
    errorMessage.value = '';
    data.whiteListData.allowIps = [];
    data.whiteListData.ipList = '';
    data.whiteListData.editable = true;
    nextTick(() => {
      if (ipInput.value) {
        ipInput.value.focus();
      }
    });
  }
};

const handleEnter = (e) => {
  e.preventDefault(); // 阻止默认的回车换行行为
  handleInputConfirm();
};

const handleInputConfirm = () => {
  if (data.whiteListData.ipList.trim() === '') {
    vaildator.value = false;
    errorMessage.value = '请输入IP地址';
    nextTick(() => {
      if (ipInput.value) {
        ipInput.value.textarea.style.boxShadow =
          '0 0 0 1px var(--el-color-danger,var(--el-color-danger)) inset';
      }
    });
    return;
  }
  if (!checkIp()) {
    console.log('进入异常');
    vaildator.value = false;
    errorMessage.value = '存在不正确的ip格式请检查';
    nextTick(() => {
      if (ipInput.value) {
        ipInput.value.textarea.style.boxShadow =
          '0 0 0 1px var(--el-color-danger,var(--el-color-danger)) inset';
        // ipInput.value.focus();
      }
    });
    return;
  }
  data.whiteListData.editable = false;
  data.whiteListData.allowIps = data.whiteListData.ipList
    .split(',')
    .filter((item) => item.trim() !== '');
};

const checkIp = () => {
  let flag = true;
  data.whiteListData.ipList
    .split(',')
    .filter((item) => item.trim() !== '')
    .forEach((item) => {
      // 出现不满足的返回false
      if (
        !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          item,
        )
      ) {
        flag = false;
      }
    });
  return flag;
};

const clearStyle = () => {
  nextTick(() => {
    if (ipInput.value) {
      vaildator.value = false;
      ipInput.value.textarea.style.boxShadow = '';
    }
  });
};

const handleClose = (index) => {
  data.whiteListData.allowIps.splice(index, 1);
  nextTick(() => {
    data.whiteListData.ipList = data.whiteListData.allowIps.join(',');
    if (data.whiteListData.ipList.trim() === '') {
      data.whiteListData.editable = true;
      nextTick(() => {
        if (ipInput.value) {
          ipInput.value.focus();
        }
      });
    }
  });
};

const enableEdit = () => {
  data.whiteListData.editable = true;
  nextTick(() => {
    if (ipInput.value) {
      ipInput.value.focus();
    }
  });
};

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getIngresses();
    }
  }
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

// 白名单开始
const handleWhiteListDialog = (row) => {
  data.whiteListData.namespace = row.metadata.namespace;
  data.whiteListData.name = row.metadata.name;

  data.whiteListData.close = true;
};

const cancelWhiteList = () => {
  data.whiteListData.close = false;
  setTimeout(() => {
    data.whiteListData.enable = false;
    data.whiteListData.allowIps = [];
    data.whiteListData.namespace = '';
    data.whiteListData.name = '';
  }, 100);
};

const confirmWhiteList = async () => {
  if (data.whiteListData.enable) {
  } else {
    const patchData = {
      metadata: {
        annotations: {
          'nginx.ingress.kubernetes.io/server-snippet': null,
        },
      },
    };

    const [res, err] = await patchIngress(
      data.cluster,
      data.whiteListData.namespace,
      data.whiteListData.name,
      patchData,
    );
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
};
// 白名单结束

const confirm = async () => {
  const [result, err] = await deleteIngress(
    data.cluster,
    data.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await getIngresses();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = searchData(data.pageInfo, data.ingressList);
};

const getIngresses = async () => {
  data.loading = true;
  const [res, err] = await getIngressList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.ingressList = res.items;
  data.pageInfo.total = data.ingressList.length;
  data.tableData = searchData(data.pageInfo, data.ingressList);
};

const createIngress = () => {
  const url = `/ingresses/createIngress?cluster=${data.cluster}`;
  router.push(url);
};

const editIngress = (row) => {
  const url = `/ingresses/editIngress?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getIngresses();
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getIngress(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.yaml = jsYaml.dump(result, { quotingType: '"' });
  data.editYamlDialog = true;
};

const closeEditYamlDialog = (row) => {
  data.yaml = '';
  data.yamlName = '';
  data.editYamlDialog = false;
};

const confirmEditYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  const [result, err] = await updateIngress(data.cluster, data.namespace, data.yamlName, yamlData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Ingress(${data.yamlName}) YAML 更新成功`);

  closeEditYamlDialog();
  await getIngresses();
};
</script>

<style scoped="scoped"></style>
