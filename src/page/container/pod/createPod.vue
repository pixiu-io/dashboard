<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 60px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToPod"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Pods </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建Pod </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card class="create-card-style" style="width: 75%">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.form"
            class="create-card-form"
          >
            <el-steps
              style="max-width: 90%; margin-left: 6px; margin-top: 15px"
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
                  <span style="margin-left: 2px; font-size: 14px; color: #191919">容器组设置 </span>
                </template>
              </el-step>

              <el-step>
                <template #title>
                  <span style="margin-left: 2px; font-size: 14px; color: #191919">高级选项 </span>
                </template>
              </el-step>
            </el-steps>

            <el-scrollbar height="450px" view-style="overflow-x: hidden" style="margin-top: 30px">
              <div v-if="data.active === 0">
                <el-form-item label="名称" prop="metadata.name">
                  <template #label>
                    <span class="form-item-key-style">名称 </span>
                  </template>

                  <el-input v-model="data.frontObject.name" style="width: 50%" />
                </el-form-item>
                <el-form-item>
                  <div class="dialog-describe-style" style="margin-left: 0px">
                    只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63
                    个字符。
                  </div>
                </el-form-item>

                <el-form-item label="命名空间">
                  <template #label>
                    <span class="form-item-key-style">命名空间 </span>
                  </template>

                  <div class="namespace-select-container">
                    <el-select
                      v-model="data.frontObject.namespace"
                      style="width: 210px"
                      @change="changeNamespace"
                    >
                      <el-option
                        v-for="item in data.namespaces"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select>
                  </div>
                </el-form-item>

                <el-form-item label="Labels">
                  <template #label>
                    <span class="form-item-key-style">Labels</span>
                  </template>

                  <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
                </el-form-item>
                <div style="margin-top: -15px"></div>
                <el-form-item
                  v-for="(item, index) in data.form.labels"
                  :key="index"
                  class="labels-item-style"
                >
                  <el-form-item
                    :prop="'labels[' + index + '].key'"
                    :rules="[{ required: true, message: '标签键不能为空', trigger: 'blur' }]"
                  >
                    <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
                  </el-form-item>

                  <div style="margin-right: 10px; margin-left: 10px">=</div>

                  <el-form-item
                    :prop="'labels[' + index + '].value'"
                    :rules="[{ required: true, message: '标签值不能为空', trigger: 'blur' }]"
                  >
                    <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
                  </el-form-item>

                  <div
                    style="float: right; cursor: pointer; margin-left: 10px"
                    @click="deleteLabel(index)"
                  >
                    <pixiu-icon
                      name="icon-shanchu"
                      size="14px"
                      type="iconfont"
                      style="margin-top: 10px; margin-left: 4px"
                      color="#909399"
                    />
                  </div>
                </el-form-item>
                <div class="app-pixiu-line-describe" style="margin-top: -5px">
                  标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
                </div>
                <el-form-item>
                  <template #label>
                    <span class="form-item-key-style">描述</span>
                  </template>
                  <el-input
                    v-model="data.frontObject.description"
                    style="margin-top: 8px; width: 60%"
                    type="textarea"
                    :autosize="data.frontObject.autosize"
                  />
                </el-form-item>
              </div>

              <div v-if="data.active === 1">
                <el-form-item label>
                  <template #label>
                    <span class="form-item-key-style">容器配置</span>
                  </template>
                  <el-button
                    type="text"
                    class="app-action-btn"
                    style="margin-top: 1px"
                    @click="addContainer"
                    >+增加容器</el-button
                  >
                </el-form-item>
                <div class="dialog-describe-style" style="margin-left: 100px; margin-bottom: -12px">
                  设置容器的镜像、名称、类型和计算资源。
                </div>

                <el-form-item v-for="(item, index) in data.frontObject.containers" :key="index">
                  <div
                    style="
                      width: 85%;
                      background-color: #f2f2f2;
                      margin-top: 20px;
                      border-radius: 0px;
                    "
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
                      <el-input v-model="item.name" style="width: 35%" />
                    </el-form-item>
                    <div
                      class="container-line-describe"
                      style="margin-left: 100px; margin-bottom: -10px"
                    >
                      名称只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长
                      63 个字符。
                    </div>

                    <el-form-item label style="margin-top: 10px">
                      <template #label>
                        <span class="form-item-key-style">镜像</span>
                      </template>
                      <el-input v-model="item.image" style="width: 50%" />
                    </el-form-item>
                    <div
                      class="container-line-describe"
                      style="margin-left: 100px; margin-bottom: -10px"
                    >
                      镜像名称或者路径，如需使用私有镜像服务，您需要先创建镜像服务密钥。
                    </div>

                    <el-form-item label style="margin-top: 10px">
                      <template #label>
                        <span class="form-item-key-style">拉取策略</span>
                      </template>
                      <el-select v-model="item.imagePullPolicy" style="width: 150px">
                        <el-option
                          v-for="item2 in data.frontObject.imagePullPolicies"
                          :key="item2"
                          :value="item2"
                          :label="item2"
                        />
                      </el-select>
                    </el-form-item>
                    <div class="container-line-describe" style="margin-left: 100px">
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
                          <el-form-item>
                            <template #label>
                              <span class="form-input-key-style" style="margin-left: 0px"
                                >CPU 预留</span
                              >
                            </template>
                            <el-input
                              v-model="item.cpuRequst"
                              placeholder="无限制"
                              style="margin-left: -25px"
                            >
                              <template #suffix>
                                <div style="font-size: 12px; color: #191919">Core</div>
                              </template>
                            </el-input>
                          </el-form-item>
                          <el-form-item label>
                            <template #label>
                              <span class="form-input-key-style">内存预留 </span>
                            </template>
                            <el-input
                              v-model="item.memoryRequst"
                              placeholder="无限制"
                              style="margin-left: -25px"
                            >
                              <template #suffix
                                ><div style="font-size: 12px; color: #191919">Mi</div>
                              </template>
                            </el-input>
                          </el-form-item>
                        </el-form-item>

                        <el-form-item>
                          <el-form-item label style="margin-top: 5px">
                            <template #label>
                              <span class="form-input-key-style" style="margin-left: 0px"
                                >CPU 限制</span
                              >
                            </template>
                            <el-input
                              v-model="item.cpuLimit"
                              placeholder="无限制"
                              style="margin-left: -25px"
                            >
                              <template #suffix>
                                <div style="font-size: 12px; color: #191919">Core</div>
                              </template>
                            </el-input>
                          </el-form-item>
                          <el-form-item label>
                            <template #label>
                              <span class="form-input-key-style">内存限制</span>
                            </template>

                            <el-input
                              v-model="item.memoryLimit"
                              placeholder="无限制"
                              style="margin-left: -25px"
                            >
                              <template #suffix
                                ><div style="font-size: 12px; color: #191919">Mi</div>
                              </template>
                            </el-input>
                          </el-form-item>
                        </el-form-item>
                      </el-form-item>
                      <div class="container-line-describe" style="margin-left: 100px">
                        设置容器的资源限制与资源预留，以将容器调度到合适的节点上。
                      </div>

                      <el-form-item label>
                        <template #label>
                          <span class="form-item-key-style">端口设置</span>
                        </template>
                        <el-checkbox v-model="item.choicePort" @change="portChange(item)" />
                      </el-form-item>
                      <div
                        class="container-line-describe"
                        style="margin-left: 100px; margin-top: -8px"
                      >
                        设置容器的端口。
                      </div>
                      <div v-if="item.choicePort">
                        <div style="margin-top: -2px">
                          <el-form-item v-for="(i, index1) in item.ports" :key="index1">
                            <el-form-item style="margin-left: 100px">
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
                              <el-input
                                v-model="i.containerPort"
                                style="width: 25%; margin-left: 10px"
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
                                @click="deletePort(item, index)"
                              >
                                删除
                              </div>
                            </el-form-item>
                          </el-form-item>
                        </div>

                        <el-form-item label>
                          <div
                            style="
                              cursor: pointer;
                              color: #006eff;
                              font-size: 12px;
                              margin-left: 100px;
                              margin-top: -1px;
                            "
                            @click="addPort(item)"
                          >
                            + 添加
                          </div>
                        </el-form-item>
                      </div>

                      <el-form-item label>
                        <template #label>
                          <span class="form-item-key-style">环境变量</span>
                        </template>
                        <el-checkbox v-model="item.choiceEnv" @change="envChange(item)" />
                      </el-form-item>
                      <div
                        class="container-line-describe"
                        style="margin-left: 100px; margin-top: -8px"
                      >
                        为容器添加添加环境变量。
                      </div>

                      <div v-if="item.choiceEnv">
                        <div style="margin-top: -2px">
                          <el-form-item v-for="(i1, index2) in item.envs" :key="index2">
                            <el-form-item style="margin-left: 100px">
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
                          <div
                            class="form-item-key-style"
                            style="
                              cursor: pointer;
                              color: #006eff;
                              font-size: 12px;
                              margin-left: 100px;
                              margin-top: -1px;
                            "
                            @click="addEnv(item)"
                          >
                            + 添加
                          </div>
                        </el-form-item>
                      </div>

                      <el-form-item label>
                        <template #label>
                          <span class="form-item-key-style">启动命令</span>
                        </template>
                        <el-checkbox v-model="item.choiceCmd" />
                      </el-form-item>
                      <div
                        class="container-line-describe"
                        style="margin-left: 100px; margin-top: -8px"
                      >
                        自定义容器启动时运行的命令。默认情况下，容器启动时将运行镜像默认命令。
                      </div>

                      <div v-if="item.choiceCmd">
                        <div style="margin-top: -2px">
                          <el-form-item style="margin-left: 100px">
                            <div style="font-size: 12px; color: #191919">命令</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 100px">
                            <el-input v-model="item.cmds.cmd" style="width: 85%" type="textarea" />
                          </el-form-item>
                          <el-form-item style="margin-left: 100px">
                            <div style="font-size: 12px; color: #191919">参数</div>
                          </el-form-item>
                          <el-form-item style="margin-left: 100px">
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
                      <div
                        class="container-line-describe"
                        style="margin-left: 100px; margin-top: -8px"
                      >
                        添加探针以定时检查容器健康状态。
                      </div>

                      <div v-if="item.choiceHealth">
                        <div style="margin-top: -2px">
                          <!-- 存活检查 -->
                          <el-form-item style="margin-left: 100px">
                            <div style="font-size: 12px; margin-right: 8px; color: #191919">
                              存活检查
                            </div>
                            <el-checkbox v-model="item.healths.liveness.enable" />
                          </el-form-item>
                          <el-form-item v-if="item.healths.liveness.enable">
                            <div style="margin-top: -2px">
                              <el-form-item style="margin-left: 100px">
                                <el-radio-group
                                  v-model="item.healths.liveness.checkType"
                                  size="small"
                                >
                                  <el-space :size="25">
                                    <el-radio :value="1">HTTP 请求</el-radio>
                                    <el-radio :value="2">命令</el-radio>
                                    <el-radio :value="3">TCP 端口</el-radio>
                                  </el-space>
                                </el-radio-group>
                              </el-form-item>

                              <div v-if="item.healths.liveness.checkType === 1">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">路径</div>
                                </el-form-item>

                                <div style="width: 650px">
                                  <el-form-item style="margin-left: 100px">
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
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">命令</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.liveness.cmd"
                                    style="width: 580px"
                                    type="textarea"
                                  />
                                </el-form-item>
                              </div>
                              <div v-if="item.healths.liveness.checkType === 3">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">端口</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.liveness.port"
                                    style="width: 580px"
                                  />
                                </el-form-item>
                              </div>

                              <el-row :gutter="20" style="margin-left: 90px">
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

                              <el-row :gutter="20" style="margin-left: 90px">
                                <el-col :span="12">
                                  <el-row>
                                    <div style="font-size: 12px; color: #191919">
                                      检查间隔（s ）
                                    </div>
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

                              <el-row :gutter="20" style="margin-left: 90px">
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
                          <el-form-item style="margin-left: 100px">
                            <div style="font-size: 12px; margin-right: 8px; color: #191919">
                              就绪检查
                            </div>
                            <el-checkbox v-model="item.healths.readiness.enable" />
                          </el-form-item>
                          <el-form-item v-if="item.healths.readiness.enable">
                            <div style="margin-top: -2px">
                              <el-form-item style="margin-left: 100px">
                                <el-radio-group
                                  v-model="item.healths.readiness.checkType"
                                  size="small"
                                >
                                  <el-space :size="25">
                                    <el-radio :value="1">HTTP 请求</el-radio>
                                    <el-radio :value="2">命令</el-radio>
                                    <el-radio :value="3">TCP 端口</el-radio>
                                  </el-space>
                                </el-radio-group>
                              </el-form-item>

                              <div v-if="item.healths.readiness.checkType === 1">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">路径</div>
                                </el-form-item>

                                <div style="width: 650px">
                                  <el-form-item style="margin-left: 100px">
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
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">命令</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.readiness.cmd"
                                    style="width: 580px"
                                    type="textarea"
                                  />
                                </el-form-item>
                              </div>
                              <div v-if="item.healths.readiness.checkType === 3">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">端口</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.readiness.port"
                                    style="width: 580px"
                                  />
                                </el-form-item>
                              </div>

                              <el-row :gutter="20" style="margin-left: 90px">
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

                              <el-row :gutter="20" style="margin-left: 90px">
                                <el-col :span="12">
                                  <el-row>
                                    <div style="font-size: 12px; color: #191919">
                                      检查间隔（s ）
                                    </div>
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

                              <el-row :gutter="20" style="margin-left: 90px">
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
                          <el-form-item style="margin-left: 100px">
                            <div style="font-size: 12px; margin-right: 8px; color: #191919">
                              启动检查
                            </div>
                            <el-checkbox v-model="item.healths.startup.enable" />
                          </el-form-item>

                          <el-form-item v-if="item.healths.startup.enable">
                            <div style="margin-top: -2px">
                              <el-form-item style="margin-left: 100px">
                                <el-radio-group
                                  v-model="item.healths.startup.checkType"
                                  size="small"
                                >
                                  <el-space :size="25">
                                    <el-radio :value="1">HTTP 请求</el-radio>
                                    <el-radio :value="2">命令</el-radio>
                                    <el-radio :value="3">TCP 端口</el-radio>
                                  </el-space>
                                </el-radio-group>
                              </el-form-item>

                              <div v-if="item.healths.startup.checkType === 1">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">路径</div>
                                </el-form-item>

                                <div style="width: 650px">
                                  <el-form-item style="margin-left: 100px">
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
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">命令</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.startup.cmd"
                                    style="width: 580px"
                                    type="textarea"
                                  />
                                </el-form-item>
                              </div>
                              <div v-if="item.healths.startup.checkType === 3">
                                <el-form-item style="margin-left: 100px">
                                  <div style="font-size: 12px; color: #191919">端口</div>
                                </el-form-item>
                                <el-form-item style="margin-left: 100px">
                                  <el-input
                                    v-model="item.healths.startup.port"
                                    style="width: 580px"
                                  />
                                </el-form-item>
                              </div>

                              <el-row :gutter="20" style="margin-left: 90px">
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

                              <el-row :gutter="20" style="margin-left: 90px">
                                <el-col :span="12">
                                  <el-row>
                                    <div style="font-size: 12px; color: #191919">
                                      检查间隔（s ）
                                    </div>
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

                              <el-row :gutter="20" style="margin-left: 90px">
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
                      <div
                        class="container-line-describe"
                        style="margin-left: 100px; margin-top: -8px"
                      >
                        将存储挂载到容器。
                      </div>
                      <div v-if="item.choiceStorage">
                        <div style="margin-top: -2px">
                          <div style="margin-left: 100px; display: flex">
                            <div style="font-size: 12px; color: #191919">存储类型</div>
                            <div style="font-size: 12px; color: #191919; margin-left: 10%">
                              名称
                            </div>
                            <div style="font-size: 12px; color: #191919; margin-left: 14%">
                              挂载源
                            </div>
                            <div style="font-size: 12px; color: #191919; margin-left: 15.5%">
                              容器挂载路径
                            </div>
                          </div>

                          <el-form-item v-for="(i, index1) in item.storages" :key="index1">
                            <el-form-item style="margin-left: 90px">
                              <el-select
                                v-model="i.volumeType"
                                style="width: 19%; margin-left: 10px; margin-right: 10px"
                                @change="changeVolumeType(i.volumeType, i)"
                              >
                                <el-option
                                  v-for="item2 in data.frontObject.storageTypeChoices"
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
                          <div
                            class="form-item-key-style"
                            style="
                              cursor: pointer;
                              color: #006eff;
                              font-size: 12px;
                              margin-left: 100px;
                              margin-top: -1px;
                            "
                            @click="addStorage(item)"
                          >
                            + 添加
                          </div>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </el-scrollbar>

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
              <el-button
                v-if="data.active > 0"
                type="primary"
                class="pixiu-delete-cancel-button"
                @click="lastStep"
                >上一步</el-button
              >
              <el-button
                v-if="data.active < 2"
                type="primary"
                class="pixiu-delete-confirm-button"
                @click="nextStep"
                >下一步</el-button
              >
              <el-button
                v-if="data.active === 2"
                type="primary"
                class="pixiu-delete-confirm-button"
                @click="confirmCreate"
                >确认</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createPod } from '@/services/kubernetes/podService';

const ruleFormRef = ref();

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  active: 0,

  cluster: '',
  clusterName: '',
  namespace: 'default',

  namespaces: [],

  frontObject: {
    name: '',
    namespace: '',
    kind: 'pod',
    description: '',
    autosize: {
      minRows: 5,
    },

    close: false,
    // 容器配置
    containers: [],

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
    restartPolicies: ['Always'],
    restartPolicy: 'Always',
    hostNetwork: false,

    // 存储设置
    storageTypeChoices: ['持久卷', '临时卷', 'HostPath卷', '配置字典', '保密字典'],
  },

  endObject: {
    metadata: {},
    spec: {
      template: {
        metadata: {},
        spec: {},
      },
    },
  },

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    containers: [],
  },
  // 创建或者更新 form
  objectForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      containers: [],
    },
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Pod 名称', trigger: 'blur' }],
};

const nextStep = () => {
  if (data.active++ >= 4) data.active = 4;
};

const lastStep = () => {
  if (data.active-- <= 0) data.active = 0;
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.objectForm.metadata = data.form.metadata;
      data.objectForm.spec.containers = data.form.containers;

      // 追加 labels
      if (data.form.labels.length > 0) {
        data.objectForm.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.objectForm.metadata['labels'][item.key] = item.value;
        }
      }

      const [result, err] = await createPod(data.cluster, data.namespace, data.objectForm);
      if (err) {
        proxy.$message.error(err.response.data.message);
        return;
      }
      proxy.$message.success(`Pod ${data.form.metadata.name} 创建成功`);

      backToPod();
    }
  });
};

const cancel = () => {
  backToPod();
};

// 添加容器相关函数开始

const openContainerAdvanceOption = (item) => {
  item.advance = !item.advance;
};

const addNodeSelectLabel = () => {
  data.frontObject.nodeSelectLabels.push({ key: '', value: '' });
};

const deleteNodeSelectLabel = (index) => {
  data.frontObject.nodeSelectLabels.splice(index, 1);
};

const metaChange = () => {
  if (data.frontObject.enableMetadata) {
    if (data.frontObject.labels.length === 0) {
      addLabel();
    }
  }
};

const addAnnotation = () => {
  data.frontObject.annotations.push({ key: '', value: '' });
};

const deleteAnnotation = (index) => {
  data.frontObject.annotations.splice(index, 1);
};

const nodeChange = () => {
  if (data.frontObject.choiceNode) {
    if (data.frontObject.nodeSelectLabels.length === 0) {
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

// 添加容器相关函数结束

const cancelCreate = () => {
  backToStatefulSet();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.cluster = data.cloud.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  addContainer();
  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.frontObject.namespace = val;
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const addLabel = () => {
  data.frontObject.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.frontObject.labels.splice(index, 1);
};

const addContainer = () => {
  data.frontObject.containers.push({
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
  data.frontObject.containers.splice(index, 1);
};

const backToPod = () => {
  proxy.$router.push({
    name: 'Pod',
    query: data.query,
  });
};
</script>

<style></style>
