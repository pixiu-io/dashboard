<template>
  <el-card shadow="never" style="border-radius: 1px" :body-style="{ padding: '5px' }">
    <el-row :gutter="10">
      <el-col :span="3">
        <!-- 容器选择框 -->
        <el-select size="small" v-model="containerValue" placeholder="请选择">
          <el-option v-for="item in containerList" :key="item" :value="item"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
        <!-- 连接按钮 -->
        <el-button style="border-radius: 2px" size="small" type="primary" @click="initSocket"
          >连接</el-button
        >
      </el-col>
      <el-col :span="1">
        <!-- 关闭连接按钮 -->
        <el-button style="border-radius: 2px" size="small" type="danger" @click="closeSocket()"
          >关闭</el-button
        >
      </el-col>
      <el-col :span="24" style="margin-top: 5px">
        <el-card shadow="never" class="pod-body-shell-card" :body-style="{ padding: '5px' }">
          <!-- xterm虚拟终端 -->
          <div id="xterm"></div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue';
//引入xterm终端依赖
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import 'xterm/lib/xterm.js';

const { proxy } = getCurrentInstance();

const data = reactive({
  //terminal
  term: null,
  socket: null,
});

onMounted(() => {
  data.cloud = proxy.$route.params;
});

const initTerm = () => {
  //初始化xterm实例
  data.term = new Terminal({
    rendererType: 'canvas', //渲染类型
    rows: 30, //行数
    cols: 110,
    convertEol: false, //启用时，光标将设置为下一行的开头
    scrollback: 10, //终端中的回滚量
    disableStdin: false, //是否应禁用输入
    cursorStyle: 'underline', //光标样式
    cursorBlink: true, //光标闪烁
    theme: {
      foreground: 'white', //字体
      background: '#060101', //背景色
      cursor: 'help', //设置光标
    },
  });
  //绑定dom
  data.term.open(document.getElementById('xterm'));
  //终端适应父元素大小
  const fitAddon = new FitAddon();
  data.term.loadAddon(fitAddon);
  fitAddon.fit();
  //获取终端的焦点
  data.term.focus();
  let _data = data; //一定要重新定义一个this，不然this指向会出问题
  //onData方法用于定义输入的动作
  data.term.onData(function (key) {
    // 这里key值是输入的值，数据格式就是后端定义的 {"operation":"stdin","data":"ls"}
    let msgOrder = {
      operation: 'stdin',
      data: key,
    };
    //发送数据
    _data.socket.send(JSON.stringify(msgOrder));
  });
};
const initSocket = () => {
  //定义websocket连接地址
  let terminalWsUrl =
    'ws://127.0.0.1:9090/webshell/ws?namespace=kube-system&pod=kubepi-679c77b8bb-2sw96&container=kubepi';

  //实例化
  data.socket = new WebSocket(terminalWsUrl);
  //关闭连接时的方法
  socketOnClose();
  //建立连接时的方法
  socketOnOpen();
  //接收消息的方法
  socketOnMessage();
  //报错时的方法
  socketOnError();
};

const socketOnOpen = () => {
  data.socket.onopen = () => {
    //建立连接成功后，初始化虚拟终端
    initTerm();
  };
};

const socketOnMessage = () => {
  data.socket.onmessage = (msg) => {
    //接收到消息后将字符串转为对象，输出data内容
    let content = JSON.parse(msg.data);
    data.term.write(content.data);
  };
};
const socketOnClose = () => {
  data.socket.onclose = () => {
    //关闭连接后打印在终端里
    data.term.write('链接已关闭');
  };
};
const socketOnError = () => {
  data.socket.onerror = () => {
    console.log('socket 链接失败');
  };
};
const closeSocket = () => {
  //若没有实例化，则不需要关闭
  if (data.socket === null) {
    return;
  }
  data.term.write('链接关闭中。。。');
  data.socket.close();
};
</script>

<style scoped="scoped"></style>
