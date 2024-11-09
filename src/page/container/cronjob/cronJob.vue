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
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getCronJobs"
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
    style="color: #000000; font: 14px; width: 950px"
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
          <span style="margin-left: 2px; font-size: 14px; color: #191919">存储设置 </span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span style="margin-left: 2px; font-size: 14px; color: #191919">高级选项 </span>
        </template>
      </el-step>
    </el-steps>

    <el-form :label-position="labelPosition" style="margin-top: 20px">
      <div v-if="data.active == 0">
        <el-form-item>
          <template #label>
            <span class="form-item-key-style">名称 </span>
          </template>
          <el-input
            v-model="data.cronJobForm.metadata.name"
            class="form-item-key-style"
            style="margin-left: 30px; width: 45%"
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
              <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
            </el-select>
          </span>
        </el-form-item>
        <el-form-item>
          <div class="dialog-describe-style" style="margin-left: 78px">
            命名空间用于对定时任务分为相互隔离的组。
          </div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="form-item-key-style">定时计划</span>
          </template>
          <el-input v-model="data.cronJobForm.spec.schedule" style="margin-left: 5px; width: 30%" />
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

      <div v-if="data.active == 1">
        <el-form-item>
          <template #label>
            <span class="form-item-key-style">最大重试次数</span>
          </template>
          <el-input v-model="data.cronJobData.backoffLimit" style="margin-left: 12px; width: 50%" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="form-item-key-style">最大运行时间 </span>
          </template>
          <el-input
            v-model="data.cronJobData.activeDeadlineSeconds"
            style="margin-left: 12px; width: 50%"
          />
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="form-item-key-style">容器组完成数量 </span>
          </template>
          <el-input v-model="data.cronJobData.completions" style="margin-left: 12px; width: 50%" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-item-key-style">并行容器组数量 </span>
          </template>
          <el-input v-model="data.cronJobData.parallelism" style="margin-left: 12px; width: 50%" />
        </el-form-item>

        <el-form-item>
          <el-button
            class="table-inline-btn"
            style="margin-left: -8px; margin-right: -20px; cursor: pointer"
            @click="openAdvanceOption"
            >高级设置</el-button
          >
        </el-form-item>
        <div v-if="data.cronJobAdvanceOptions.enable === true">
          <el-form-item>
            <template #label>
              <span class="form-item-key-style">最大启动延后时间</span>
            </template>
            <el-input
              v-model="data.cronJobAdvanceOptions.startingDeadlineSeconds"
              style="width: 30%"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">成功任务保留数量</span>
            </template>
            <el-input
              v-model="data.cronJobAdvanceOptions.successfulJobsHistoryLimit"
              style="width: 30%"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">失败任务保留数量 </span>
            </template>
            <el-input
              v-model="data.cronJobAdvanceOptions.failedJobsHistoryLimit"
              style="width: 30%"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="form-item-key-style">并发策略 </span>
            </template>
            <span style="margin-left: 40px">
              <el-select
                v-model="data.cronJobAdvanceOptions.concurrencyPolicy"
                style="width: 210px; float: right; margin-right: 10px"
              >
                <el-option
                  v-for="item in data.cronJobAdvanceOptions.concurrencyPolicies"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </span>
          </el-form-item>
        </div>
      </div>

      <div v-if="data.active == 2">
        <el-form-item label>
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
          <div style="width: 90%; background-color: #f2f2f2; margin-top: 20px; border-radius: 0px">
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
              <div class="container-line-describe" style="margin-left: 10px; margin-bottom: -10px">
                名称只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63
                个字符。
              </div>
            </el-form-item>

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
            <div class="container-line-describe">设置镜像拉取策略，默认使用 IfNotPresent 策略</div>

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
                      <el-input
                        v-model="i.protocol"
                        style="width: 20%; margin-left: 10px; margin-right: 10px"
                      />
                      <div style="font-size: 12px; color: #191919">名称</div>
                      <el-input
                        v-model="i.name"
                        style="width: 20%; margin-left: 10px; margin-right: 10px"
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
                检查容器健康状态。
              </div>

              <div v-if="item.choiceHealth">
                <div style="margin-top: -2px">
                  <el-form-item style="margin-left: 70px">
                    <div style="font-size: 12px; margin-right: 8px; color: #191919">存活检查</div>
                    <el-checkbox v-model="item.healths.liveness.enable" />
                  </el-form-item>
                  <el-form-item style="margin-left: 70px">
                    <div style="font-size: 12px; margin-right: 8px; color: #191919">就绪检查</div>
                    <el-checkbox v-model="item.healths.readiness.enable" />
                  </el-form-item>
                  <el-form-item style="margin-left: 70px">
                    <div style="font-size: 12px; margin-right: 8px; color: #191919">启动检查</div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>

      <div v-if="data.active == 3">
        <el-form-item label>
          <template #label>
            <span class="form-item-key-style">存储设置</span>
          </template>
        </el-form-item>
      </div>

      <div v-if="data.active == 4">
        <el-form-item label>
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
          v-if="data.active < 4"
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="nextStep"
          >下一步</el-button
        >
        <el-button
          v-if="data.active === 4"
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="confirmCreate"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

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
import { reactive, getCurrentInstance, onMounted, ref, onUnmounted } from 'vue';
import jsYaml from 'js-yaml';
import { getTableData } from '@/utils/utils';
import { makePodTemplate, makeObjectMetadata } from '@/utils/k8s';
import {
  formatterLabels,
  formatterNamespace,
  formatterTime,
  formatterCronJobStatus,
} from '@/utils/formatter';
import { getLocalNamespace, getNamespaceList } from '@/services/kubernetes/namespaceService';
import {
  createCronJob,
  getCronJobList,
  deleteCronJob,
  patchCronJob,
} from '@/services/kubernetes/cronjobService';
import Description from '@/components/description/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const editYaml = ref();

const data = reactive({
  cluster: '',
  namespace: 'default',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
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
  },
  cronJobAdvanceOptions: {
    enable: false,
    concurrencyPolicy: 'Allow',
    concurrencyPolicies: ['Allow'],
    successfulJobsHistoryLimit: '',
    failedJobsHistoryLimit: '',
    startingDeadlineSeconds: '',
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
    image: '',
    imagePullPolicy: 'IfNotPresent',
    advance: false,
    cpuRequst: '',
    cpuLimit: '',
    memoryRequst: '',
    memoryLimit: '',
    choicePort: false,
    ports: [],
    choiceEnv: false,
    envs: [],
    choiceCmd: false,
    cmds: {
      cmd: '',
      args: '',
    },
    choiceHealth: false,
    healths: {
      liveness: {
        enable: false,
      },
      readiness: {
        enable: false,
      },
    },
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

const handleCreateDialog = (row) => {
  getNamespaces();
  addContainer();
  data.cronJobData.close = true;
};

const openAdvanceOption = () => {
  data.cronJobAdvanceOptions.enable = !data.cronJobAdvanceOptions.enable;
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
    };

    data.cronJobAdvanceOptions = {
      enable: false,
      concurrencyPolicy: 'Allow',
      concurrencyPolicies: ['Allow'],
      successfulJobsHistoryLimit: '',
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

  data.tableData = getTableData(data.pageInfo, data.deploymentList);
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
  data.yamlName = row.metadata.name;
  const [result, err] = await getDeployment(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = jsYaml.dump(result, { quotingType: '"' });
  data.editYamlDialog = true;
};

const getCronJobs = async () => {
  if (!data.noLoading) {
    data.loading = true;
  }

  const [result, err] = await getCronJobList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.deploymentList = result.items;
  data.pageInfo.total = data.deploymentList.length;
  data.tableData = getTableData(data.pageInfo, data.deploymentList);
};
</script>

<style scoped="scoped"></style>
