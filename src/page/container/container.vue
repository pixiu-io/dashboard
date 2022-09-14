<template>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px;">
        <el-row>
            <el-col>
                <span style="font-weight: bold; font-size: 18px; vertical-align: middle;"> 容器服务 </span>
                <span style="font-size: 12px; margin-left: 10px; vertical-align: middle; margin-right: 10px">地域</span>

                <el-select v-model="value" placeholder="Select">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                    />
                </el-select>

                <span style="font-size: 12px; float: right; color: rgba(0,0,0,.9); vertical-align: middle; margin-left: 5px"> 管理指南
                    <el-icon style="vertical-align: middle; margin-right: 10px;">
                        <Edit />
                    </el-icon>
                </span>
           </el-col>
        </el-row>
    </el-card>

    <el-card class="app-docs">
        <div style="vertical-align: middle; margin-top: -10px">已有超级节点能力全面升级，支持更多集群版本</div>
    </el-card>

    <div style="margin-top: 40px;">
        <el-row>
            <el-col>
                <el-button type="primary" @click="handleCreate" style="margin-left: 1px;">
                    <el-icon style="vertical-align: middle;margin-right: 4px;">
                        <plus />
                    </el-icon> 新建集群
                </el-button>

                <el-input placeholder="多个过滤标签用回车分隔" v-model="pageInfo.query" style="width: 560px; float: right;"
                    clearable @input="getCloudList" @clear="getCloudList" :suffix-icon="Search">
                    <template #suffix>
                        <el-icon class="el-input__icon">
                            <search />
                        </el-icon>
                    </template>
                </el-input>

            </el-col>
        </el-row>

        <el-card class="box-card">
            <el-table :data="cloudList" stripe style="margin-top: 2px; width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">

                <!-- <el-table-column type="selection" width="38" /> -->

                <el-table-column prop="name" label="名称/ID" width="200">
                    <template #default="scope">
                        <el-link type="primary" @click="jumpRoute(scope.row.label_id)"> {{ scope.row.name }} </el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="状态" width="200" />
                <el-table-column prop="cloud_type" label="集群类型" width="200" />
                <el-table-column prop="kube_version" label="kubernetes版本" width="200" />
                <el-table-column prop="node_number" label="节点数" width="200" />
                <el-table-column prop="resources" label="资源量" />

                <el-table-column fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" plain size="small" @click="handleEdit(scope.row)">
                            <el-icon style="vertical-align: middle; margin-right: 5px;">
                                <Edit />
                            </el-icon> 编辑
                        </el-button>

                        <el-button type="primary" plain size="small" @click="handleDelete(scope.row)"
                            style="margin-right: 10px">
                            <el-icon style="vertical-align: middle;margin-right: 5px;">
                                <Delete />
                            </el-icon> 删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页区域 -->
            <el-pagination style="float: right; margin-right: 40px; margin-top: 20px; margin-bottom: 20px;"
                v-model:currentPage="pageInfo.page" v-model:page-size="pageInfo.page_size" :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />

        </el-card>
    </div>
</template>

<script>
    import {
        Refresh,
        Search,
        Delete,
        Edit,
        ArrowDown,
        Plus,
        Upload,
        Download,
        UploadFilled,
        DocumentCopy,
        FolderOpened,
        FolderAdd
    } from '@element-plus/icons-vue'

    export default {
        data() {
            return {
                pageInfo: {
                    query: '',
                    use_page: true, // 默认启用分页效果
                    page: 1,
                    page_size: 10, // 默认值需要是分页定义的值
                },

                loading: false,

                cloudList: [], // k8s 集群列表

                autosize: {
                    minRows: 8,
                },

                value: '无锡',
                options: [
                    {
                        value: '无锡',
                        label: '无锡',
                    },
                    {
                        value: '宿迁',
                        label: '宿迁',
                    },
                    {
                        value: '杭州',
                        label: '杭州',
                        disabled: true,
                    },
                ],
            }
        },
        created() {
            this.getCloudList()
        },
        methods: {
            async getCloudList() {
                this.loading = true
                const {
                    data: res
                } = await this.$http.get('/clouds', {
                    params: this.pageInfo
                })
                this.loading = false
                if (res.code != 200) {
                    return this.$message.error('获取集群列表失败');
                }
                this.pageInfo.page = res.result.page
                this.pageInfo.page_size = res.result.page_size
                this.cloudList = res.result
                this.total = 10
            },
            handleSizeChange(newSize) {
                this.pageInfo.page_size = newSize
                this.getLabelList()
            },
            handleCurrentChange(newPage) {
                this.pageInfo.page = newPage
                this.getLabelList()
            },
        },
        components: {
            DocumentCopy,
            Search,
            Edit,
            Delete,
            ArrowDown,
            Plus,
            Upload,
            Download,
            Refresh,
            UploadFilled,
            FolderOpened,
            FolderAdd
        }
    }
</script>

<style>
    .box-card {
        margin-top: 20px;
        /* width: 480px; */
    }

    .app-docs {
        margin-top: 20px;
        height: 60px;
        font-size: 12px;
        line-height: inherit;
        padding: 14px 20px;
        vertical-align: middle;
        color: #002da0;
        border: 1px solid #d5e7ff;
        border-radius: 0;
        background: #d5e7ff;
        position: relative;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
</style>