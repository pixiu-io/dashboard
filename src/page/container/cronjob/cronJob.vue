<template>
  <Description
    :description="'定时任务（CronJob）管理基于时间的任务（Job），可用于运行周期性任务或重复性任务'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="handleCreateDialog">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getCronJobs">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getCronJobs"
          @input="getCronJobs"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getCronJobs"
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
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称">
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

        <el-table-column
          prop="spec"
          label="状态"
          :formatter="formatterCronJobStatus"
        ></el-table-column>

        <el-table-column prop="spec.schedule" label="定时计划" />

        <!-- <el-table-column
          prop="spec.template.metadata.labels"
          label="Labels"
          :formatter="formatterLabels"
        />

        <el-table-column
          prop="spec.selector.matchLabels"
          label="Selector"
          :formatter="formatterLabels"
        >
        </el-table-column> -->

        <el-table-column
          prop="status.lastScheduleTime"
          label="上次执行时间"
          sortable
          :formatter="formatterTime"
        />

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              class="table-item-left1-buttom"
              @click="editCronJob(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              size="small"
              type="text"
              class="table-item-left2-buttom"
              @click="changeCronJobSuspend(scope.row)"
            >
              <div v-if="scope.row.spec.suspend">启动</div>
              <div v-else>暂停</div>
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
                  <el-dropdown-item class="dropdown-item-buttons"> 修改定时计划 </el-dropdown-item>
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

  <el-dialog
    :model-value="data.cronJobData.close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="color: #000000; font-size: 14px; width: 950px"
    @close="cancelCreate"
  >
    <template #header>
      <div class="dialog-header-style">创建定时任务</div>
    </template>
    <div style="margin-top: 5px"></div>

    <el-steps
      style="max-width: 100%; margin-left: 6px"
      :active="data.active"
      finish-status="success"
    >
      <el-step>
        <template #title>
          <span style="margin-left: 2px; font-size: 14px; color: #191919">基本信息 </span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span style="margin-left: 2px; font-size: 14px; color: #191919">策略设置 </span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span style="margin-left: 2px; font-size: 14px; color: #191919">容器设置 </span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span style="margin-left: 2px; font-size: 14px; color: #191919">高级选项 </span>
        </template>
      </el-step>
    </el-steps>

    <el-scrollbar height="480px" view-style="overflow-x: hidden">
      <el-form style="margin-top: 20px">
        <div v-if="data.active === 0">
          <el-form-item>
            <template #label>
              <span class="form-item-key-style">名称 </span>
            </template>
            <el-input
              v-model="data.cronJobForm.metadata.name"
              class="form-item-key-style"
              style="margin-left: 30px; width: 60%"
            />
          </el-form-item>

          <el-form-item>
            <div class="dialog-describe-style" style="margin-left: 78px">
              只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63 个字符。
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">命名空间 </span>
            </template>
            <span style="margin-left: 4px">
              <el-select
                v-model="data.cronJobForm.metadata.namespace"
                style="width: 210px; float: right; margin-right: 10px"
              >
                <el-option
                  v-for="item in data.namespaces"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </span>
          </el-form-item>
          <el-form-item>
            <div class="dialog-describe-style" style="margin-left: 78px">
              命名空间用于对定时任务进行逻辑隔离。
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">定时计划 </span>
            </template>
            <span style="margin-left: 4px">
              <el-select
                v-model="data.cronJobForm.spec.schedule"
                value-key="id"
                filterable
                allow-create
                style="width: 210px; float: right; margin-right: 10px"
              >
                <el-option
                  v-for="item in data.cronJobSpecData.schedules"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </span>
          </el-form-item>
          <el-form-item>
            <div class="dialog-describe-style" style="margin-left: 76px">
              为定时任务设置定时计划。格式 * * * * *
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">描述</span>
            </template>
            <el-input
              v-model="data.cronJobForm.description"
              style="margin-left: 30px; margin-top: 5px; width: 60%"
              type="textarea"
              :autosize="data.autosize"
            />
          </el-form-item>
        </div>

        <div v-if="data.active === 1">
          <el-row>
            <el-col>
              <el-row :gutter="20" style="margin-left: 1px">
                <el-col :span="12">
                  <el-row>
                    <div class="form-change-key-style">最大重试次数</div>
                  </el-row>
                  <div style="margin-top: 10px"></div>
                  <el-row>
                    <el-input v-model="data.cronJobData.backoffLimit" style="width: 90%" />
                  </el-row>
                </el-col>

                <el-col :span="12">
                  <el-row>
                    <div class="form-change-key-style">最大运行时间</div>
                  </el-row>
                  <div style="margin-top: 10px"></div>
                  <el-row>
                    <el-input v-model="data.cronJobData.activeDeadlineSeconds" style="width: 90%" />
                  </el-row>
                </el-col>
              </el-row>
              <div style="margin-top: 10px"></div>

              <el-row :gutter="20" style="margin-left: 0px">
                <el-col :span="12">
                  <el-row>
                    <div class="form-change-key-style">容器组完成数量</div>
                  </el-row>
                  <div style="margin-top: 10px"></div>
                  <el-row>
                    <el-input v-model="data.cronJobData.completions" style="width: 90%" />
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row>
                    <div class="form-change-key-style">并行容器组数量</div>
                  </el-row>
                  <div style="margin-top: 10px"></div>
                  <el-row>
                    <el-input v-model="data.cronJobData.parallelism" style="width: 90%" />
                  </el-row>
                </el-col>
              </el-row>

              <el-form-item>
                <el-button
                  type="text"
                  class="app-action-btn"
                  style="margin-top: 5px; margin-left: 8px"
                  @click="openAdvanceOption"
                  >高级设置</el-button
                >
              </el-form-item>

              <div v-if="data.cronJobData.enableAdvanceOptions === true">
                <el-row :gutter="20" style="margin-left: 0">
                  <el-col :span="12">
                    <el-row>
                      <div class="form-change-key-style">最大启动延后时间（s）</div>
                    </el-row>
                    <div style="margin-top: 10px"></div>
                    <el-row>
                      <el-input
                        v-model="data.cronJobData.startingDeadlineSeconds"
                        style="width: 90%"
                      />
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <div class="form-change-key-style">成功任务保留数量</div>
                    </el-row>
                    <div style="margin-top: 10px"></div>
                    <el-row>
                      <el-input
                        v-model="data.cronJobData.successfulJobsHistoryLimit"
                        style="width: 90%"
                      />
                    </el-row>
                  </el-col>
                </el-row>

                <div style="margin-top: 10px"></div>

                <el-row :gutter="20" style="margin-left: 0px">
                  <el-col :span="12">
                    <el-row>
                      <div class="form-change-key-style">失败任务保留数量</div>
                    </el-row>
                    <div style="margin-top: 10px"></div>
                    <el-row>
                      <el-input
                        v-model="data.cronJobData.failedJobsHistoryLimit"
                        style="width: 90%"
                      />
                    </el-row>
                  </el-col>

                  <el-col :span="12">
                    <el-row>
                      <div class="form-change-key-style">并发策略</div>
                    </el-row>
                    <div style="margin-top: 10px"></div>
                    <el-row>
                      <el-select v-model="data.cronJobData.concurrencyPolicy" style="width: 90%">
                        <el-option
                          v-for="item in data.cronJobData.concurrencyPolicies"
                          :key="item"
                          :value="item"
                          :label="item"
                        />
                      </el-select>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="data.active === 2">
          <el-form-item>
            <template #label>
              <span class="form-item-key-style">重启策略</span>
            </template>

            <span style="margin-left: 10px">
              <el-select
                v-model="data.cronJobData.restartPolicy"
                style="width: 180px; float: right; margin-right: 10px"
              >
                <el-option
                  v-for="item in data.cronJobData.restartPolicies"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </span>
          </el-form-item>
          <div class="dialog-describe-style" style="margin-left: 82px; margin-top: -10px">
            选择容器组中的容器异常退出时，容器集群采取的策略。
          </div>

          <el-form-item label>
            <template #label>
              <span class="form-item-key-style">容器配置</span>
            </template>
            <el-button
              type="text"
              class="app-action-btn"
              style="margin-top: 1px; margin-left: 8px"
              @click="addContainer"
              >+增加容器</el-button
            >
          </el-form-item>
          <div class="dialog-describe-style" style="margin-left: 80px; margin-bottom: -12px">
            设置容器的镜像、名称、类型和计算资源。
          </div>

          <el-form-item
            v-for="(item, index) in data.cronJobData.containers"
            :key="index"
            style="margin-left: 80px"
          >
            <div
              style="width: 90%; background-color: #f2f2f2; margin-top: 20px; border-radius: 0px"
            >
              <div
                style="float: right; cursor: pointer; margin-top: 10px; margin-right: 15px"
                @click="deleteContainer(index)"
              >
                <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
              </div>

              <div style="margin-top: 18px"></div>
              <el-form-item label>
                <template #label>
                  <span class="form-item-key-style">容器名称</span>
                </template>
                <el-input v-model="item.name" style="margin-left: 10px; width: 45%" />
                <div
                  class="container-line-describe"
                  style="margin-left: 10px; margin-bottom: -10px"
                >
                  名称只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63
                  个字符。
                </div>
              </el-form-item>

              <!-- <el-form-item label style="margin-top: 10px">
              <template #label>
                <span class="form-item-key-style">容器类型 </span>
              </template>
              <span style="margin-left: 10px">
                <el-select
                  v-model="item.containerType"
                  style="width: 150px; float: right; margin-right: 10px"
                >
                  <el-option
                    v-for="item2 in item.containerTypes"
                    :key="item2"
                    :value="item2"
                    :label="item2"
                  />
                </el-select>
              </span>
            </el-form-item> -->

              <el-form-item label style="margin-top: 10px">
                <template #label>
                  <span class="form-item-key-style">镜像</span>
                </template>
                <el-input v-model="item.image" style="margin-left: 36px; width: 42%" />
              </el-form-item>

              <el-form-item label style="margin-top: 10px">
                <template #label>
                  <span class="form-item-key-style">拉取策略</span>
                </template>
                <span style="margin-left: 10px">
                  <el-select
                    v-model="item.imagePullPolicy"
                    style="width: 150px; float: right; margin-right: 10px"
                  >
                    <el-option
                      v-for="item2 in data.cronJobData.imagePullPolicies"
                      :key="item2"
                      :value="item2"
                      :label="item2"
                    />
                  </el-select>
                </span>
              </el-form-item>
              <div class="container-line-describe">
                设置镜像拉取策略，默认使用 IfNotPresent 策略
              </div>

              <el-form-item label>
                <template #label>
                  <span
                    class="form-item-key-style"
                    style="cursor: pointer; color: #006eff; font-size: 12px"
                    @click="openContainerAdvanceOption(item)"
                    >高级设置</span
                  >
                </template>
              </el-form-item>

              <div v-if="item.advance">
                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">资源</span>
                  </template>

                  <el-form-item>
                    <el-form-item label style="margin-left: 30px">
                      <template #label>
                        <span class="form-input-key-style">CPU 预留</span>
                      </template>
                      <el-input v-model="item.cpuRequst" placeholder="无限制">
                        <template #suffix>
                          <div style="font-size: 12px; color: #191919">Core</div>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label>
                      <template #label>
                        <span class="form-input-key-style">内存预留 </span>
                      </template>
                      <el-input v-model="item.memoryRequst" placeholder="无限制">
                        <template #suffix
                          ><div style="font-size: 12px; color: #191919">Mi</div>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form-item>

                  <el-form-item>
                    <el-form-item label style="margin-left: 30px; margin-top: 5px">
                      <template #label>
                        <span class="form-input-key-style">CPU 限制</span>
                      </template>
                      <el-input v-model="item.cpuLimit" placeholder="无限制">
                        <template #suffix>
                          <div style="font-size: 12px; color: #191919">Core</div>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label>
                      <template #label>
                        <span class="form-input-key-style">内存限制</span>
                      </template>

                      <el-input v-model="item.memoryLimit" placeholder="无限制">
                        <template #suffix
                          ><div style="font-size: 12px; color: #191919">Mi</div>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form-item>
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 85px">
                  设置容器的资源限制与资源预留，以将容器调度到合适的节点上。
                </div>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">端口设置</span>
                  </template>
                  <el-checkbox v-model="item.choicePort" @change="portChange(item)" />
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 72px; margin-top: -8px">
                  设置容器的端口。
                </div>
                <div v-if="item.choicePort">
                  <div style="margin-top: -2px">
                    <el-form-item v-for="(i, index1) in item.ports" :key="index1">
                      <el-form-item style="margin-left: 70px">
                        <div style="font-size: 12px; color: #191919">协议</div>
                        <el-select
                          v-model="i.protocol"
                          style="width: 18%; margin-left: 10px; margin-right: 10px"
                        >
                          <el-option
                            v-for="itemP in item.portProtocols"
                            :key="itemP"
                            :value="itemP"
                            :label="itemP"
                          />
                        </el-select>

                        <div style="font-size: 12px; color: #191919">名称</div>
                        <el-input
                          v-model="i.name"
                          style="width: 21%; margin-left: 10px; margin-right: 10px"
                        />
                        <div style="font-size: 12px; color: #191919">容器端口</div>
                        <el-input v-model="i.containerPort" style="width: 25%; margin-left: 10px" />
                        <div
                          class="table-inline-btn"
                          style="
                            float: right;
                            cursor: pointer;
                            margin-left: 15px;
                            margin-top: 6px;
                            background-color: #f2f2f2;
                          "
                          @click="deletePort(item, index)"
                        >
                          删除
                        </div>
                      </el-form-item>
                    </el-form-item>
                  </div>

                  <el-form-item label>
                    <template #label>
                      <span
                        class="form-item-key-style"
                        style="
                          cursor: pointer;
                          color: #006eff;
                          font-size: 12px;
                          margin-left: 70px;
                          margin-top: -1px;
                        "
                        @click="addPort(item)"
                        >+ 添加</span
                      >
                    </template>
                  </el-form-item>
                </div>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">环境变量</span>
                  </template>
                  <el-checkbox v-model="item.choiceEnv" @change="envChange(item)" />
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 72px; margin-top: -8px">
                  为容器添加添加环境变量。
                </div>

                <div v-if="item.choiceEnv">
                  <div style="margin-top: -2px">
                    <el-form-item v-for="(i1, index2) in item.envs" :key="index2">
                      <el-form-item style="margin-left: 70px">
                        <div style="font-size: 12px; color: #191919">类型</div>
                        <el-input
                          v-model="i1.type"
                          style="width: 16%; margin-left: 10px; margin-right: 10px"
                        />
                        <el-input
                          v-model="i1.key"
                          style="width: 30%; margin-left: 10px; margin-right: 10px"
                          placeholder="键"
                        />
                        <el-input
                          v-model="i1.value"
                          style="width: 30%; margin-left: 10px"
                          placeholder="值"
                        />
                        <div
                          class="table-inline-btn"
                          style="
                            float: right;
                            cursor: pointer;
                            margin-left: 15px;
                            margin-top: 6px;
                            background-color: #f2f2f2;
                          "
                          @click="deleteEnv(item, index)"
                        >
                          删除
                        </div>
                      </el-form-item>
                    </el-form-item>
                  </div>
                  <el-form-item label>
                    <template #label>
                      <span
                        class="form-item-key-style"
                        style="
                          cursor: pointer;
                          color: #006eff;
                          font-size: 12px;
                          margin-left: 70px;
                          margin-top: -1px;
                        "
                        @click="addEnv(item)"
                        >+ 添加</span
                      >
                    </template>
                  </el-form-item>
                </div>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">启动命令</span>
                  </template>
                  <el-checkbox v-model="item.choiceCmd" />
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 72px; margin-top: -8px">
                  自定义容器启动时运行的命令。默认情况下，容器启动时将运行镜像默认命令。
                </div>

                <div v-if="item.choiceCmd">
                  <div style="margin-top: -2px">
                    <el-form-item style="margin-left: 70px">
                      <div style="font-size: 12px; color: #191919">命令</div>
                    </el-form-item>
                    <el-form-item style="margin-left: 70px">
                      <el-input v-model="item.cmds.cmd" style="width: 85%" type="textarea" />
                    </el-form-item>
                    <el-form-item style="margin-left: 70px">
                      <div style="font-size: 12px; color: #191919">参数</div>
                    </el-form-item>
                    <el-form-item style="margin-left: 70px">
                      <el-input
                        v-model="item.cmds.args"
                        style="width: 85%"
                        type="textarea"
                        placeholder="启动命令的参数, 如有多个参数请使用半角逗号（,）分隔。"
                      />
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">健康检查</span>
                  </template>
                  <el-checkbox v-model="item.choiceHealth" />
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 72px; margin-top: -8px">
                  添加探针以定时检查容器健康状态。
                </div>

                <div v-if="item.choiceHealth">
                  <div style="margin-top: -2px">
                    <!-- 存活检查 -->
                    <el-form-item style="margin-left: 70px">
                      <div style="font-size: 12px; margin-right: 8px; color: #191919">存活检查</div>
                      <el-checkbox v-model="item.healths.liveness.enable" />
                    </el-form-item>
                    <el-form-item v-if="item.healths.liveness.enable">
                      <div style="margin-top: -2px">
                        <el-form-item style="margin-left: 70px">
                          <el-radio-group v-model="item.healths.liveness.checkType" size="small">
                            <el-space :size="25">
                              <el-radio :value="1">HTTP 请求</el-radio>
                              <el-radio :value="2">命令</el-radio>
                              <el-radio :value="3">TCP 端口</el-radio>
                            </el-space>
                          </el-radio-group>
                        </el-form-item>

                        <div v-if="item.healths.liveness.checkType === 1">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">路径</div>
                          </el-form-item>

                          <div style="width: 650px">
                            <el-form-item style="margin-left: 70px">
                              <el-select
                                v-model="item.healths.liveness.httpGet.scheme"
                                style="width: 30%"
                              >
                                <el-option
                                  v-for="i in item.schemes"
                                  :key="i"
                                  :value="i"
                                  :label="i"
                                />
                              </el-select>
                              <el-input
                                v-model="item.healths.liveness.httpGet.path"
                                style="width: 30%; margin-left: 15px"
                              />
                              <el-input
                                v-model="item.healths.liveness.httpGet.port"
                                style="width: 30%; margin-left: 15px"
                              />
                            </el-form-item>
                          </div>
                        </div>

                        <div v-if="item.healths.liveness.checkType === 2">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">命令</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input
                              v-model="item.healths.liveness.cmd"
                              style="width: 580px"
                              type="textarea"
                            />
                          </el-form-item>
                        </div>
                        <div v-if="item.healths.liveness.checkType === 3">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">端口</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input v-model="item.healths.liveness.port" style="width: 580px" />
                          </el-form-item>
                        </div>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">初始延迟（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.liveness.initialDelaySeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">超时时间（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.liveness.timeoutSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">检查间隔（s ）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.liveness.periodSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">成功阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.liveness.successThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">失败阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.liveness.failureThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                    </el-form-item>

                    <!-- 就绪检查 -->
                    <el-form-item style="margin-left: 70px">
                      <div style="font-size: 12px; margin-right: 8px; color: #191919">就绪检查</div>
                      <el-checkbox v-model="item.healths.readiness.enable" />
                    </el-form-item>
                    <el-form-item v-if="item.healths.readiness.enable">
                      <div style="margin-top: -2px">
                        <el-form-item style="margin-left: 70px">
                          <el-radio-group v-model="item.healths.readiness.checkType" size="small">
                            <el-space :size="25">
                              <el-radio :value="1">HTTP 请求</el-radio>
                              <el-radio :value="2">命令</el-radio>
                              <el-radio :value="3">TCP 端口</el-radio>
                            </el-space>
                          </el-radio-group>
                        </el-form-item>

                        <div v-if="item.healths.readiness.checkType === 1">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">路径</div>
                          </el-form-item>

                          <div style="width: 650px">
                            <el-form-item style="margin-left: 70px">
                              <el-select
                                v-model="item.healths.readiness.httpGet.scheme"
                                style="width: 30%"
                              >
                                <el-option
                                  v-for="i in item.schemes"
                                  :key="i"
                                  :value="i"
                                  :label="i"
                                />
                              </el-select>
                              <el-input
                                v-model="item.healths.readiness.httpGet.path"
                                style="width: 30%; margin-left: 15px"
                              />
                              <el-input
                                v-model="item.healths.readiness.httpGet.port"
                                style="width: 30%; margin-left: 15px"
                              />
                            </el-form-item>
                          </div>
                        </div>

                        <div v-if="item.healths.readiness.checkType === 2">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">命令</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input
                              v-model="item.healths.readiness.cmd"
                              style="width: 580px"
                              type="textarea"
                            />
                          </el-form-item>
                        </div>
                        <div v-if="item.healths.readiness.checkType === 3">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">端口</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input v-model="item.healths.readiness.port" style="width: 580px" />
                          </el-form-item>
                        </div>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">初始延迟（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.readiness.initialDelaySeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">超时时间（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.readiness.timeoutSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">检查间隔（s ）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.readiness.periodSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">成功阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.readiness.successThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">失败阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.readiness.failureThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                    </el-form-item>

                    <!-- 启动检查 -->
                    <el-form-item style="margin-left: 70px">
                      <div style="font-size: 12px; margin-right: 8px; color: #191919">启动检查</div>
                      <el-checkbox v-model="item.healths.startup.enable" />
                    </el-form-item>

                    <el-form-item v-if="item.healths.startup.enable">
                      <div style="margin-top: -2px">
                        <el-form-item style="margin-left: 70px">
                          <el-radio-group v-model="item.healths.startup.checkType" size="small">
                            <el-space :size="25">
                              <el-radio :value="1">HTTP 请求</el-radio>
                              <el-radio :value="2">命令</el-radio>
                              <el-radio :value="3">TCP 端口</el-radio>
                            </el-space>
                          </el-radio-group>
                        </el-form-item>

                        <div v-if="item.healths.startup.checkType === 1">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">路径</div>
                          </el-form-item>

                          <div style="width: 650px">
                            <el-form-item style="margin-left: 70px">
                              <el-select
                                v-model="item.healths.startup.httpGet.scheme"
                                style="width: 30%"
                              >
                                <el-option
                                  v-for="i in item.schemes"
                                  :key="i"
                                  :value="i"
                                  :label="i"
                                />
                              </el-select>
                              <el-input
                                v-model="item.healths.startup.httpGet.path"
                                style="width: 30%; margin-left: 15px"
                              />
                              <el-input
                                v-model="item.healths.startup.httpGet.port"
                                style="width: 30%; margin-left: 15px"
                              />
                            </el-form-item>
                          </div>
                        </div>

                        <div v-if="item.healths.startup.checkType === 2">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">命令</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input
                              v-model="item.healths.startup.cmd"
                              style="width: 580px"
                              type="textarea"
                            />
                          </el-form-item>
                        </div>
                        <div v-if="item.healths.startup.checkType === 3">
                          <el-form-item style="margin-left: 70px">
                            <div style="font-size: 12px; color: #191919">端口</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 70px">
                            <el-input v-model="item.healths.startup.port" style="width: 580px" />
                          </el-form-item>
                        </div>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">初始延迟（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.startup.initialDelaySeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">超时时间（s）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.startup.timeoutSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">检查间隔（s ）</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.startup.periodSeconds"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">成功阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.startup.successThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>

                        <el-row :gutter="20" style="margin-left: 60px">
                          <el-col :span="12">
                            <el-row>
                              <div style="font-size: 12px; color: #191919">失败阈值</div>
                            </el-row>
                            <el-row>
                              <el-input
                                v-model="item.healths.startup.failureThreshold"
                                style="width: 100%"
                              />
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                    </el-form-item>
                  </div>
                </div>

                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">存储设置</span>
                  </template>
                  <el-checkbox v-model="item.choiceStorage" @change="storageChange(item)" />
                </el-form-item>
                <div class="container-line-describe" style="margin-left: 72px; margin-top: -8px">
                  将存储挂载到容器。
                </div>
                <div v-if="item.choiceStorage">
                  <div style="margin-top: -2px">
                    <div style="margin-left: 70px; display: flex">
                      <div style="font-size: 12px; color: #191919">存储类型</div>
                      <div style="font-size: 12px; color: #191919; margin-left: 14%">名称</div>
                      <div style="font-size: 12px; color: #191919; margin-left: 18.5%">挂载源</div>
                      <div style="font-size: 12px; color: #191919; margin-left: 21.5%">
                        容器挂载路径
                      </div>
                    </div>

                    <el-form-item v-for="(i, index1) in item.storages" :key="index1">
                      <el-form-item style="margin-left: 60px">
                        <el-select
                          v-model="i.volumeType"
                          style="width: 19%; margin-left: 10px; margin-right: 10px"
                          @change="changeVolumeType(i.volumeType, i)"
                        >
                          <el-option
                            v-for="item2 in data.cronJobData.storageTypeChoices"
                            :key="item2"
                            :value="item2"
                            :label="item2"
                          />
                        </el-select>

                        <el-input
                          v-model="i.name"
                          style="width: 20%; margin-left: 10px; margin-right: 10px"
                          placeholder="请输入卷名称"
                        />

                        <div
                          v-if="i.volumeType == '临时卷'"
                          style="width: 25%; margin-left: 10px; margin-right: 7px"
                        >
                          <el-input v-model="i.mountSrc" placeholder="emptyDir" disabled />
                        </div>
                        <el-input
                          v-else-if="i.volumeType == 'HostPath卷'"
                          v-model="i.mountSrc"
                          style="width: 25%; margin-left: 9px; margin-right: 8px"
                          placeholder="主机路径"
                        />
                        <el-select
                          v-else
                          v-model="i.mountSrc"
                          style="width: 160px; margin-left: 10px; margin-right: 10px"
                        >
                          <el-option
                            v-for="itemSrc in i.mountSrcs"
                            :key="itemSrc"
                            :value="itemSrc"
                            :label="itemSrc"
                          />
                        </el-select>

                        <el-input
                          v-model="i.mountPath"
                          style="width: 20%; margin-left: 10px"
                          placeholder="容器路径"
                        />
                        <div
                          class="table-inline-btn"
                          style="
                            float: right;
                            cursor: pointer;
                            margin-left: 10px;
                            margin-top: 6px;
                            background-color: #f2f2f2;
                          "
                          @click="deleteStorage(item, index)"
                        >
                          删除
                        </div>
                      </el-form-item>
                    </el-form-item>
                  </div>

                  <el-form-item label>
                    <template #label>
                      <span
                        class="form-item-key-style"
                        style="
                          cursor: pointer;
                          color: #006eff;
                          font-size: 12px;
                          margin-left: 70px;
                          margin-top: -1px;
                        "
                        @click="addStorage(item)"
                        >+ 添加</span
                      >
                    </template>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>

        <div v-if="data.active === 3">
          <el-form-item>
            <template #label>
              <span class="form-item-key-style">主机网络</span>
            </template>
            <el-checkbox v-model="data.cronJobData.hostNetwork" />
          </el-form-item>
          <div class="dialog-describe-style">容器使用宿主机网络。</div>
          <div style="margin-top: 15px"></div>

          <el-form-item label>
            <template #label>
              <span class="form-item-key-style">选择节点</span>
            </template>
            <el-checkbox v-model="data.cronJobData.choiceNode" @change="nodeChange" />
          </el-form-item>
          <div class="dialog-describe-style">
            分配 Pod 到特定的节点。支持使用标签选择节点和手动指定节点。
          </div>

          <div v-if="data.cronJobData.choiceNode">
            <div style="margin-top: 25px"></div>
            <el-form-item
              v-for="(item, index) in data.cronJobData.nodeSelectLabels"
              :key="index"
              style="margin-top: -10px"
            >
              <el-form-item prop="item.key">
                <el-input v-model="item.key" style="width: 300px; margin-left: 10px" />
              </el-form-item>
              <div>
                <el-input v-model="item.value" style="width: 300px; margin-left: 20px" />
              </div>
              <div
                class="table-inline-btn"
                style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
                @click="deleteNodeSelectLabel(index)"
              >
                删除
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                class="table-inline-btn"
                style="
                  margin-left: -5px;
                  margin-right: -20px;
                  margin-top: -15px;
                  margin-bottom: -15px;
                  cursor: pointer;
                "
                @click="addNodeSelectLabel"
                >+ 添加</el-button
              >
            </el-form-item>
          </div>

          <div style="margin-top: 15px"></div>
          <el-form-item label>
            <template #label>
              <span class="form-item-key-style">添加元数据</span>
            </template>
            <el-checkbox v-model="data.cronJobData.enableMetadata" @change="metaChange" />
          </el-form-item>
          <div class="dialog-describe-style">为定时任务添加标签和注解数据</div>

          <div v-if="data.cronJobData.enableMetadata">
            <el-form-item>
              <template #label>
                <span class="form-item-key-style">标签</span>
              </template>
            </el-form-item>
            <el-form-item
              v-for="(item, index) in data.cronJobData.labels"
              :key="index"
              style="margin-top: -10px"
            >
              <el-form-item prop="item.key">
                <el-input
                  v-model="item.key"
                  style="width: 300px; margin-left: 10px"
                  placeholder="键"
                />
              </el-form-item>
              <div>
                <el-input
                  v-model="item.value"
                  style="width: 300px; margin-left: 20px"
                  placeholder="值"
                />
              </div>
              <div
                class="table-inline-btn"
                style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
                @click="deleteLabel(index)"
              >
                删除
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                class="table-inline-btn"
                style="
                  margin-left: -5px;
                  margin-right: -20px;
                  margin-top: -15px;
                  margin-bottom: -15px;
                  cursor: pointer;
                "
                @click="addLabel"
                >+ 添加</el-button
              >
            </el-form-item>

            <el-form-item>
              <template #label>
                <span class="form-item-key-style">注解</span>
              </template>
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.cronJobData.annotations"
              :key="index"
              style="margin-top: -10px"
            >
              <el-form-item prop="item.key">
                <el-input
                  v-model="item.key"
                  style="width: 300px; margin-left: 10px"
                  placeholder="键"
                />
              </el-form-item>
              <div>
                <el-input
                  v-model="item.value"
                  style="width: 300px; margin-left: 20px"
                  placeholder="值"
                />
              </div>
              <div
                class="table-inline-btn"
                style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
                @click="deleteAnnotation(index)"
              >
                删除
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                class="table-inline-btn"
                style="
                  margin-left: -5px;
                  margin-right: -20px;
                  margin-top: -15px;
                  margin-bottom: -15px;
                  cursor: pointer;
                "
                @click="addAnnotation"
                >+ 添加</el-button
              >
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-scrollbar>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelCreate">取消</el-button>

        <el-button
          v-if="data.active > 0"
          type="primary"
          class="pixiu-delete-cancel-button"
          @click="lastStep"
          >上一步</el-button
        >
        <el-button
          v-if="data.active < 3"
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="nextStep"
          >下一步</el-button
        >
        <el-button
          v-if="data.active === 3"
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="confirmCreate"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑YAML"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getCronJobs"
  ></PiXiuViewOrEdit>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  ref,
  onUnmounted,
  onBeforeUnmount,
  onBeforeMount,
} from 'vue';
import jsYaml from 'js-yaml';
import { getTableData } from '@/utils/utils';
import { makePodTemplate, makeObjectMetadata } from '@/utils/k8s';
import {
  formatterLabels,
  formatterNamespace,
  formatterTime,
  formatterCronJobStatus,
} from '@/utils/formatter';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import { getLocalNamespace, getNamespaceList } from '@/services/kubernetes/namespaceService';
import {
  createCronJob,
  getCronJob,
  getCronJobList,
  deleteCronJob,
  patchCronJob,
} from '@/services/kubernetes/cronjobService';
import { getPersistentVolumeClaimList } from '@/services/kubernetes/persistentVolumeClaimService';
import { getConfigmapList } from '@/services/kubernetes/configmapService';
import { getSecretList } from '@/services/kubernetes/secretService';
import Description from '@/components/description/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  cluster: '',
  namespace: 'default',

  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },
  tableData: [],

  loading: false,
  noLoading: false,

  autosize: {
    minRows: 5,
  },

  // yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  cronJobData: {
    close: false,

    // 选择节点配置
    choiceNode: false,
    nodeSelectLabels: [],
    // 添加元数据
    enableMetadata: false,
    labels: [],
    annotations: [],
    // 容器配置
    containers: [],
    imagePullPolicies: ['IfNotPresent', 'Always', 'Never'],
    restartPolicies: ['OnFailure', 'Never'],
    restartPolicy: 'OnFailure',
    hostNetwork: false,
    // 并行容器组熟练
    parallelism: '',
    // 完成数量
    completions: '',
    // 最大运行时间
    activeDeadlineSeconds: '',
    // 最大重试次数
    backoffLimit: '',

    // 高级配置选项
    enableAdvanceOptions: false,
    concurrencyPolicy: 'Allow',
    concurrencyPolicies: ['Allow', 'Forbid', 'Replace'],
    // 默认3
    successfulJobsHistoryLimit: '',
    // 默认1
    failedJobsHistoryLimit: '',
    startingDeadlineSeconds: '',

    // 存储设置
    storageTypeChoices: ['持久卷', '临时卷', 'HostPath卷', '配置字典', '保密字典'],
  },

  cronJobSpecData: {
    schedules: [
      {
        id: '0 * * * *',
        label: '0 * * * * (每小时)',
      },
      {
        id: '0 0 * * *',
        label: '0 0 * * * (每天)',
      },
      {
        id: '0 0 * * 0',
        label: '0 0 * * 0 (每周)',
      },
      {
        id: '0 0 1 * *',
        label: '0 0 1 * * (每月)',
      },
    ],
  },

  active: 0,
  namespaces: [],
  cronJobForm: {
    metadata: {
      name: '',
      namespace: '',
    },
    spec: {
      jobTemplate: {
        spec: {
          template: {
            spec: {},
          },
        },
      },
      schedule: '',
      suspend: false,
    },
  },

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '定时任务',
    deleteName: '',
    deleteNamespace: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);
  getCronJobs();
});

onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

onBeforeMount(() => {
  data.timer = window.setInterval(() => {
    getCronJobs();
  }, 3000);
});

onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getCronJobs();
    }
  }
};

// 创建开始
const nodeChange = () => {
  if (data.cronJobData.choiceNode) {
    if (data.cronJobData.nodeSelectLabels.length === 0) {
      addNodeSelectLabel();
    }
  }
};

const envChange = (item) => {
  if (item.choiceEnv) {
    if (item.envs.length === 0) {
      addEnv(item);
    }
  }
};

const addEnv = (item) => {
  item.envs.push({
    type: '自定义',
    key: '',
    value: '',
  });
};

const deleteEnv = (item, index) => {
  item.envs.splice(index, 1);
};

const portChange = (item) => {
  if (item.choicePort) {
    if (item.ports.length === 0) {
      addPort(item);
    }
  }
};

const addPort = (item) => {
  item.ports.push({
    name: '',
    protocol: 'TCP',
    containerPort: '',
  });
};

const deletePort = (item, index) => {
  item.ports.splice(index, 1);
};

const addStorage = (item) => {
  item.storages.push({
    volumeType: 'HostPath卷',
    name: '',
    mountSrc: '',
    mountPath: '',
  });
};

const deleteStorage = (item, index) => {
  item.storages.splice(index, 1);
};

const storageChange = (item) => {
  if (item.choiceStorage) {
    if (item.storages.length === 0) {
      addStorage(item);
    }
  }
};

const addNodeSelectLabel = () => {
  data.cronJobData.nodeSelectLabels.push({ key: '', value: '' });
};

const deleteNodeSelectLabel = (index) => {
  data.cronJobData.nodeSelectLabels.splice(index, 1);
};

const metaChange = () => {
  if (data.cronJobData.enableMetadata) {
    if (data.cronJobData.labels.length === 0) {
      addLabel();
    }
    // if (data.cronJobData.annotations.length === 0) {
    //   addAnnotation();
    // }
  }
};

const addLabel = () => {
  data.cronJobData.labels.push({ key: '', value: '' });
};

const deleteLabel = (index) => {
  data.cronJobData.labels.splice(index, 1);
};

const addAnnotation = () => {
  data.cronJobData.annotations.push({ key: '', value: '' });
};

const deleteAnnotation = (index) => {
  data.cronJobData.annotations.splice(index, 1);
};

const addContainer = () => {
  data.cronJobData.containers.push({
    name: '',
    containerType: '工作容器',
    containerTypes: ['工作容器', '初始化容器'],
    image: '',
    imagePullPolicy: 'IfNotPresent',
    advance: false,
    cpuRequst: '',
    cpuLimit: '',
    memoryRequst: '',
    memoryLimit: '',
    choicePort: false,
    ports: [],
    portProtocols: ['TCP', 'UDP', 'SCTP'],
    choiceEnv: false,
    envs: [],
    choiceCmd: false,
    cmds: {
      cmd: '',
      args: '',
    },
    choiceHealth: false,
    healthCheckTypes: ['HTTP 请求', '命令', 'TCP 端口'],
    schemes: ['HTTP', 'HTTPS'],
    healths: {
      liveness: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },
        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
      readiness: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },

        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
      startup: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },

        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
    },
    // 容器存储
    choiceStorage: false,
    storages: [],
    mountSrcs: [],
  });
};

const deleteContainer = (index) => {
  data.cronJobData.containers.splice(index, 1);
};

const nextStep = () => {
  if (data.active++ >= 4) data.active = 4;
};

const lastStep = () => {
  if (data.active-- <= 0) data.active = 0;
};

const changeVolumeType = async (volumeType, item) => {
  item.mountSrc = '';
  item.mountSrcs = [];
  if (volumeType === '持久卷') {
    const [result, err] = await getPersistentVolumeClaimList(
      data.cluster,
      data.namespace,
      data.pageInfo,
    );
    if (err) {
      proxy.$message.error(err.response.data.message);
      return;
    }
    for (let v of result.items) {
      item.mountSrcs.push(v.metadata.name);
    }
  }
  if (volumeType === '配置字典') {
    const [result, err] = await getConfigmapList(data.cluster, data.namespace);
    if (err) {
      proxy.$message.error(err.response.data.message);
      return;
    }
    for (let cm of result.items) {
      item.mountSrcs.push(cm.metadata.name);
    }
  }
  if (volumeType === '保密字典') {
    const [result, err] = await getSecretList(data.cluster, data.namespace);
    if (err) {
      proxy.$message.error(err.response.data.message);
      return;
    }
    for (let secret of result.items) {
      item.mountSrcs.push(secret.metadata.name);
    }
  }
};

const handleCreateDialog = (row) => {
  getNamespaces();
  addContainer();
  data.cronJobData.close = true;
};

const openAdvanceOption = () => {
  data.cronJobData.enableAdvanceOptions = !data.cronJobData.enableAdvanceOptions;
};

const openContainerAdvanceOption = (item) => {
  item.advance = !item.advance;
};

const confirmCreate = async () => {
  // 添加元数据
  if (data.cronJobData.enableMetadata) {
    if (data.cronJobData.labels.length !== 0) {
      let newLabels = {};
      for (let l of data.cronJobData.labels) {
        newLabels[l.key] = l.value;
      }
      data.cronJobForm.metadata['labels'] = newLabels;
    }
  }
  if (data.cronJobData.annotations.length !== 0) {
    let newannotations = {};
    for (let a of data.cronJobData.annotations) {
      newannotations[a.key] = a.value;
    }
    data.cronJobForm.metadata['annotations'] = newannotations;
  }

  if (data.cronJobData.parallelism !== '') {
    data.cronJobForm.spec.jobTemplate.spec.parallelism = parseInt(data.cronJobData.parallelism);
  }
  if (data.cronJobData.completions !== '') {
    data.cronJobForm.spec.jobTemplate.spec.completions = parseInt(data.cronJobData.completions);
  }
  if (data.cronJobData.activeDeadlineSeconds !== '') {
    data.cronJobForm.spec.jobTemplate.spec.activeDeadlineSeconds = parseInt(
      data.cronJobData.activeDeadlineSeconds,
    );
  }
  if (data.cronJobData.backoffLimit !== '') {
    data.cronJobForm.spec.jobTemplate.spec.backoffLimit = parseInt(data.cronJobData.backoffLimit);
  }

  if (data.cronJobData.successfulJobsHistoryLimit !== '') {
    data.cronJobForm.spec.successfulJobsHistoryLimit = parseInt(
      data.cronJobData.successfulJobsHistoryLimit,
    );
  }
  if (data.cronJobData.failedJobsHistoryLimit !== '') {
    data.cronJobForm.spec.failedJobsHistoryLimit = parseInt(
      data.cronJobData.failedJobsHistoryLimit,
    );
  }
  if (data.cronJobData.startingDeadlineSeconds !== '') {
    data.cronJobForm.spec.startingDeadlineSeconds = parseInt(
      data.cronJobData.startingDeadlineSeconds,
    );
  }

  data.cronJobForm.spec.jobTemplate.spec.template.spec = makePodTemplate(data.cronJobData);

  const [result, err] = await createCronJob(
    data.cluster,
    data.cronJobForm.metadata.namespace,
    data.cronJobForm,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  proxy.$message.success(`定时任务(${data.cronJobForm.metadata.name}) 创建成功`);
  cancelCreate();
  getCronJobs();
};

const cancelCreate = () => {
  data.cronJobData.close = false;
  data.active = 0;

  setTimeout(() => {
    data.active = 0;
    data.cronJobData = {
      close: false,
      // 选择节点配置
      choiceNode: false,
      nodeSelectLabels: [],
      // 添加元数据
      enableMetadata: false,
      labels: [],
      annotations: [],
      // 容器配置
      containers: [],
      imagePullPolicies: ['IfNotPresent', 'Always', 'Never'],
      restartPolicy: 'OnFailure',
      parallelism: '',
      // 完成数量
      completions: '',
      // 最大运行时间
      activeDeadlineSeconds: '',
      // 最大重试次数
      backoffLimit: '',

      // 高级配置选项
      enableAdvanceOptions: false,
      concurrencyPolicy: 'Allow',
      concurrencyPolicies: ['Allow', 'Forbid', 'Replace'],
      // 默认3
      successfulJobsHistoryLimit: '',
      // 默认1
      failedJobsHistoryLimit: '',
      startingDeadlineSeconds: '',
    };

    data.namespaces = [];
    data.cronJobForm = {
      metadata: {
        name: '',
        namespace: '',
      },
      spec: {
        jobTemplate: {
          spec: {
            template: {
              spec: {},
            },
          },
        },
        schedule: '',
        suspend: false,
      },
    };
  }, 100);
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceList(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = [];
  for (let ns of result.items) {
    data.namespaces.push(ns.metadata.name);
  }
};
// 创建结束

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
  data.deleteDialog.deleteNamespace = row.metadata.namespace;
};

const confirm = async () => {
  const [result, err] = await deleteCronJob(
    data.cluster,
    data.deleteDialog.deleteNamespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`定时任务(${data.deleteDialog.deleteName}) 删除成功`);

  getCronJobs();
  clean();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;

  setTimeout(() => {
    data.deleteDialog.deleteName = '';
    data.deleteDialog.deleteNamespace = '';
  }, 100);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  getCronJobs();
};

const changeCronJobSuspend = async (row) => {
  const patchData = {
    spec: {
      suspend: !row.spec.suspend,
    },
  };

  const [result, err] = await patchCronJob(
    data.cluster,
    row.metadata.namespace,
    row.metadata.name,
    patchData,
  );
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.noLoading = true;
  getCronJobs();
  data.noLoading = false;
};

const handleEditYamlDialog = async (row) => {
  const [result, err] = await getCronJob(data.cluster, row.metadata.namespace, row.metadata.name);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};

const getCronJobs = async () => {
  const [result, err] = await getCronJobList(data.cluster, data.namespace, data.pageInfo);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.pageInfo.total = result.total;
  data.tableData = result.items;
};
</script>

<style>
/* .el-overlay-dialog {
  overflow: hidden;
} */

.el-overlay-dialog {
  scrollbar-width: none;
}
</style>
