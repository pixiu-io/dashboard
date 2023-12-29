<template>
  <el-card class="title-card-container">
    <div class="font-container">基本信息</div>
  </el-card>

  <dev class="one-line-style">
    <el-card class="content1-card-container"> 集群信息</el-card>
    <el-card class="content2-card-container"> 集群资源使用情况</el-card>
  </dev>
</template>

<style>
.content1-card-container {
  height: 500px;
  width: 30%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}

.content2-card-container {
  height: 500px;
  width: 100%;
  margin-top: 25px;
  margin-left: 25px;
  margin-right: 10px;

  border-radius: 0px;
}
</style>
