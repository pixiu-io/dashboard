<template>
  <div style="margin-top: 20px; margin-left: 20px">
    <el-form
      label-width="100px"
      status-icon
      label-position="left"
      require-asterisk-position="right"
    >
      <div class="group">
        <div class="right-label">访问设置</div>
        <div class="context">
          <el-form-item label="服务(Service)">
            <el-button link type="primary">TODO</el-button>
          </el-form-item>
          <el-form-item label="路由(Ingress)">
            <el-button link type="primary">TODO</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="group">
        <div class="right-label">调度设置</div>
        <div class="context">
          <el-form-item label="节点亲和性">TODO</el-form-item>
          <el-form-item label="应用亲和性">TODO</el-form-item>
          <el-form-item label="应用反亲和性">TODO</el-form-item>
          <el-form-item label="调度容忍">TODO</el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup></script>

<style scoped>
.group {
  display: flex;
  margin-bottom: 10px;
  background-color: rgb(248, 247, 247);
}

.group:hover {
  -webkit-box-shadow: #ccc 0px 5px 5px;
  -moz-box-shadow: #ccc 0px 5px 5px;
  box-shadow: #ccc 0px 5px 5px;
  .right-label {
    background-color: #a5a5a5;
  }
}

.right-label {
  background-color: #cfcfcf;
  display: flex;
  align-items: center;
  justify-items: center;
  margin-right: 42px;
  width: 28px;
  font-size: 15px;
  text-align: center;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
}
.context {
  margin-top: 10px;
}
</style>
