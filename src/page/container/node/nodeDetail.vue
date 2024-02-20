<template>
  <div style="width: 100%">
    <el-card class="detail-card-style-header">
      <div style="width: 100%; background: #ffffff; display: flex; align-items: center">
        <pixiu-icon
          name="icon-back"
          style="cursor: pointer; margin-left: 4px"
          size="16px"
          type="iconfont"
          color="#006eff"
          @click="goToNode"
        />

        <el-breadcrumb separator="/" style="margin-left: 10px">
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> Node </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> Node详情 </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-tabs
        v-model="data.activeName"
        class="detail-card-style"
        @tab-click="handleClick"
        @tab-change="handleChange"
      >
        <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
        <el-tab-pane label="Pod实例" name="second"></el-tab-pane>
        <el-tab-pane label="监控" name="third"></el-tab-pane>
        <el-tab-pane label="事件" name="four"></el-tab-pane>
        <el-tab-pane label="YAML" name="five"></el-tab-pane>
      </el-tabs>
    </el-card>

    <div>
      <div v-if="data.activeName === 'first'">
        <el-card class="contend-card-container2" style="margin-left: 50px; margin-right: 50px">
          <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>
          <div
            v-if="data.nodeObject.metadata"
            style="margin-top: 8px; width: 100%; border-radius: 0px"
          >
            <el-form-item label="名称" class="detail-card-style-form">
              <span class="detail-card-style-form2" style="margin-left: 90px">
                {{ data.nodeObject.metadata.name }}
              </span>
            </el-form-item>

            <el-form-item label="创建时间" class="detail-card-style-form">
              <span class="detail-card-style-form2" style="margin-left: 63px">
                {{ data.nodeObject.metadata.creationTimestamp }}
              </span>
            </el-form-item>

            <el-form-item label="Labels" class="detail-card-style-form">
              <span class="detail-card-style-form2" style="margin-left: 75px">
                <div v-if="data.nodeObject.metadata.labels === undefined">-</div>
                <div v-else>
                  <div
                    v-for="(item, index) in data.nodeObject.metadata.labels"
                    :key="item"
                    style="margin-top: -1px"
                  >
                    <el-tag type="info" style="margin-top: 5px">{{ index }}: {{ item }}</el-tag>
                    <!-- {{ index }}: {{ item }} -->
                  </div>
                </div>
              </span>
            </el-form-item>

            <el-form-item label="Annotations" class="detail-card-style-form">
              <span class="detail-card-style-form2" style="margin-left: 42px">
                <div v-if="data.nodeObject.metadata.annotations === undefined">-</div>
                <div v-else>
                  <div
                    v-for="(item, index) in data.nodeObject.metadata.annotations"
                    :key="item"
                    style="margin-top: -1px"
                  >
                    <el-tag type="info" style="margin-top: 5px">{{ index }}: {{ item }}</el-tag>
                  </div>
                </div>
              </span>
            </el-form-item>
          </div></el-card
        >

        <div v-if="data.activeName === 'second'">
          <div style="margin-top: 20px">
            <el-row>
              <el-col>
                <button class="pixiu-two-button">刷新</button>
                <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">
                  销毁重建
                </button>

                <div style="margin-left: 8px; float: right; margin-top: 6px">
                  <pixiu-icon
                    name="icon-icon-refresh"
                    style="cursor: pointer"
                    size="14px"
                    type="iconfont"
                    color="#909399"
                    @click="getNodePods"
                  />
                </div>

                <el-input
                  v-model="data.pageInfo.query"
                  placeholder="名称搜索关键字"
                  style="width: 480px; float: right"
                  clearable
                  @clear="getNodePods"
                >
                  <template #suffix>
                    <pixiu-icon
                      name="icon-search"
                      style="cursor: pointer"
                      size="15px"
                      type="iconfont"
                      color="#909399"
                      @click="getNodePods"
                    />
                  </template>
                </el-input>
                <div style="float: right">
                  <el-switch v-model="data.crontab" inline-prompt width="36px" /><span
                    style="font-size: 13px; margin-left: 5px; margin-right: 10px"
                    >自动刷新</span
                  >
                </div>
              </el-col>
            </el-row>
          </div>
          <el-card style="margin-top: 15px" class="contend-card-container2">
            <el-table
              v-loading="data.loading"
              :data="data.nodePods"
              stripe
              style="margin-top: 10px; width: 100%; margin-bottom: 25px"
              header-row-class-name="pixiu-table-header"
              :cell-style="{
                'font-size': '12px',
                color: '#29292b',
              }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="30" />
              <el-table-column prop="metadata.name" label="实例名称" min-width="70px">
                <template #default="scope">
                  {{ scope.row.metadata.name }}
                  <el-tooltip content="复制">
                    <pixiu-icon
                      name="icon-copy"
                      size="11px"
                      type="iconfont"
                      class-name="icon-box"
                      color="#909399"
                      @click="copy(scope.row)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column prop="status" label="状态" :formatter="formatterStatus" />
              <el-table-column prop="status.hostIP" label="所在节点" />

              <el-table-column prop="status.podIP" label="实例IP">
                <template #default="scope">
                  {{ scope.row.status.podIP }}
                  <el-tooltip content="复制">
                    <pixiu-icon
                      name="icon-copy"
                      size="11px"
                      type="iconfont"
                      class-name="icon-box"
                      color="#909399"
                      @click="copyIP(scope.row)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                prop="status.containerStatuses"
                label="重启次数"
                :formatter="getPodRestartCount"
              />

              <el-table-column
                prop="metadata.creationTimestamp"
                label="创建时间"
                :formatter="formatterTime"
              />
              <el-table-column fixed="right" label="操作" width="160px">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    style="margin-right: -25px; margin-left: -10px; color: #006eff"
                    @click="deletePod(scope.row)"
                  >
                    销毁重建
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    style="margin-right: 1px; color: #006eff"
                    @click="openShell(scope.row)"
                  >
                    远程连接
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { getNode } from '@/services/kubernetes/nodeService';
import { getPodsByNode } from '@/services/kubernetes/podService';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  name: '',
  clusterName: '',
  cluster: '',

  nodeObject: '',

  crontab: true,
  nodePods: [],

  activeName: 'first',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  await getNodeObject();

  getNodePods();
});

const getNodeObject = async () => {
  const [result, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodeObject = result;
};

const getNodePods = async () => {
  const [result, err] = await getPodsByNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodePods = result.items;
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};
</script>

<style scoped="scoped"></style>
