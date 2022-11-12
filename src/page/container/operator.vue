<template>
  <div>
    <el-tabs v-model="data.activeName">
      <el-tab-pane label="Operator市场" name="1">
        <el-row>
          <el-col>
            <el-button
              type="primary"
              style="margin-left: 1px"
              @click="data.dialogFormVisible = true"
            >
              创建
            </el-button>
            <el-input
              placeholder="请输入需要搜索的名称"
              style="width: 480px; float: right"
              clearable
            >
              <template #suffix>
                <el-icon class="el-input__icon">
                  <component :is="'Search'" />
                </el-icon>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-card v-for="item in data.operatorList" :key="item.name" class="card">
          <img :src="item.image" class="image" />
          <div class="content">
            <span>{{ item.name }}</span>
            <div class="time">
              <span>{{ item.desc }}</span>
            </div>
          </div>
          <el-button type="text" class="button" @click="data.dialogFormVisible = true"
            >订阅</el-button
          >
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="已安装Operator" name="2">
        <el-row>
          <el-col>
            <el-input
              v-model="data.pageInfo.query"
              placeholder="请输入需要搜索的名称"
              style="width: 480px; float: right"
              clearable
              @input="getOperators"
              @clear="getOperators"
            >
              <template #suffix>
                <el-icon class="el-input__icon">
                  <component :is="'Search'" />
                </el-icon>
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          :data="data.operatorInstanceList"
          stripe
          style="margin-top: 40px; width: 100%"
          :header-cell-style="{
            background: '#f4f3f9',
            color: '#606266',
            height: '40px',
          }"
        >
          <el-table-column prop="name" label="名称" sortable>
            <template #default="scope">
              <el-link style="color: #006eff" type="primary" @click="jumpRoute(scope.row)">
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="190" />
          <el-table-column prop="status" label="状态" width="190" />
          <el-table-column prop="instance" label="实例数" width="190" />
          <el-table-column prop="create_at" label="创建时间" width="190" sortable />
          <el-table-column fixed="right" label="操作" width="320">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="color: #006eff"
                @click="editDeployment(scope.row)"
              >
                设置
              </el-button>

              <el-button
                v-permissions="'user:cloud:delete'"
                type="text"
                size="small"
                style="margin-right: 10px; color: #006eff"
                @click="editReplicas(scope.row)"
              >
                扩缩容
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item style="color: #006eff"> 删除 </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template #empty>
            <div style="text-align: center">
              还没有 Operator，现在就
              <button class="app-pixiu-btn--link" @click="createDeployment">立即安装</button> 一个吧
            </div>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      v-model="data.dialogFormVisible"
      title="订阅中间件"
      :direction="data.direction"
      :before-close="handleClose"
    >
      <el-collapse v-model="data.activeName" @change="handleChange">
        <h2>Redis分布式缓存</h2>
        <div>
          <span class="subcontent">
            基于云原生架构设计的一款高性能、高可用的分布式缓存数据库，兼容 Redis
            协议，支持跨数据中心高可用、混合存储、自动化运维、故障自愈、平滑扩展等云原生特性。基于高可靠双机主从热备和可平滑扩展的集群架构，满足高性能场景以及弹性变配的业务需求。
          </span>
        </div>
        <h2>特性介绍：</h2>
        <el-collapse-item title="一致性 Consistency" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>
            在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
          </div>
        </el-collapse-item>
        <el-collapse-item title="高性能 Feedback" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="运维效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="自主可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="primary" style="margin-top: 30px; float: right" @click="data.drawer = false"
        >一键安装</el-button
      >
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
  },
  loading: true,
  operatorList: [],
  operatorInstanceList: [],
  currentDate: new Date(),
  activeName: '1',
  dialogFormVisible: false,
  direction: 'rtl',
});

onMounted(() => {
  getOperators();
});

const getOperators = async () => {
  data.operatorList = [
    {
      name: 'Redis',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式缓存数据库',
      image:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.zhimg.com%2Fv2-275ea85da55f7fc2fd587907d2b5a1ef_1440w.jpg%3Fsource%3D172ae18b&refer=http%3A%2F%2Fpic1.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670767180&t=3052cc87d07ee5fba64a57121c802095',
    },
    {
      name: 'ElasticSearch',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式全文检索中间件',
      image:
        'https://images.contentstack.io/v3/assets/bltefdd0b53724fa2ce/blt280217a63b82a734/6202d3378b1f312528798412/elastic-logo.svg',
    },
    {
      name: 'Zookeeper',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式分布式协调管理器',
      image:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2F20200822164035211.png&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670810655&t=77b2f67805c2281aff5ad0400c02e4a7',
    },
    {
      name: 'ETCD',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式数据存储中间件',
      image:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload-images.jianshu.io%2Fupload_images%2F6852280-150f9c836c4cf49e.png%3FimageMogr2%2Fauto-orient%2Fstrip%257CimageView2%2F2%2Fw%2F1240&refer=http%3A%2F%2Fupload-images.jianshu.io&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670810474&t=cd8cbf5574f0d47720271123ca3af535',
    },
    {
      name: 'Kafka',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式消息数据库',
      image:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2Fimg_convert%2Fcbf2beba037b800fac81ff258ae5c8f5.png%23pic_center&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670810256&t=4d532c4e3278936a05f6923105183c38',
    },
    {
      name: 'RoacketMQ',
      desc: '基于云原生架构设计的一款高性能、高可用的分布式消息队列中间件',
      image:
        'https://img2.baidu.com/it/u=3835814986,94942776&fm=253&fmt=auto&app=138&f=PNG?w=500&h=333',
    },
  ];
  data.operatorInstanceList = [
    {
      create_at: '2016-05-02',
      name: 'Redis001',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
    {
      date: '2016-05-04',
      name: 'Redis002',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
    {
      create_at: '2016-05-01',
      name: 'Redis003',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
    {
      create_at: '2016-05-02',
      name: 'Redis001',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
    {
      date: '2016-05-04',
      name: 'Redis002',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
    {
      create_at: '2016-05-01',
      name: 'Redis003',
      status: '运行中',
      instance: 2,
      version: '4.5.0',
    },
  ];
};
</script>

<style scoped="scoped">
.time {
  padding-top: 10px;
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.card {
  margin-top: 35px;
  margin-left: 45px;
  width: 260px;
  height: 300px;
  float: left;
}

.content {
  margin: 15px;
  padding: 15px;
  text-align: center;
}

.subcontent {
  margin-top: 80px;
  padding-top: 80px;
  font-size: 13px;
  color: #303133;
}

.button {
  float: right;
  padding-bottom: 5px;
}

.image {
  width: 100%;
  height: 90px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
h2 {
  margin-top: 30px;
}
.clearfix:after {
  clear: both;
}
</style>
