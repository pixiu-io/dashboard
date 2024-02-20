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
        <el-tab-pane label="实例管理" name="second"></el-tab-pane>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { getNode } from '@/services/kubernetes/nodeService';

const { proxy } = getCurrentInstance();

const data = reactive({
  name: '',
  clusterName: '',
  cluster: '',

  nodeObject: '',

  activeName: 'first',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  await getNodeObject();
});

const getNodeObject = async () => {
  const [res, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }

  data.nodeObject = res;
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
