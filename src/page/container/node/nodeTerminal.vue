<template>
  <div ref="terminalContainer" class="terminal-container"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, reactive } from 'vue';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
const msgData = '1';
const msgResize = '2';
const terminalContainer = ref(null);
let terminal;
let fitAddon;

const { host, user, password, port, auth_model } = defineProps({
  host: {
    type: String,
    required: true,
    default: '192.168.3.102',
  },
  user: {
    type: String,
    required: true,
    default: 'test',
  },
  password: {
    type: String,
    required: true,
    default: 'test',
  },
  port: {
    type: Number,
    default: 22,
  },
  auth_model: {
    type: Number,
    default: 1,
  },
});
const data = reactive({
  rows: 20,
  cols: 80,
});

onMounted(() => {
  if (terminalContainer.value) {
    terminal = new Terminal({
      rendererType: 'canvas', //渲染类型
      convertEol: false, //启用时，光标将设置为下一行的开头
      disableStdin: false, //是否应禁用输入
      cursorStyle: 'underline', //光标样式
      cursorBlink: true, //光标闪烁
      theme: {
        cursor: 'help', //设置光标
      },
    });
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    // 初始化Xterm和FitAddon
    const webSocket = new WebSocket(
      `ws://192.168.3.103:8090/pixiu/nodes/webterminal?host=${host}&user=${user}&password=${password}&port=${port}&auth_model=${auth_model}`,
    );
    webSocket.addEventListener('error', (event) => {
      console.log('WebSocket error: ', event);
    });
    webSocket.binaryType = 'arraybuffer';
    const enc = new TextDecoder('utf-8');
    webSocket.onmessage = (event) => {
      terminal.write(enc.decode(event.data));
    };

    webSocket.onopen = () => {
      // 将终端挂载到指定的 DOM 容器中
      terminal.open(terminalContainer.value);
      fitAddon.fit();
      terminal.focus();
    };

    webSocket.onclose = () => {
      terminal.write('\r\WebTerminal quit!');
    };

    webSocket.onerror = (event) => {
      console.error(event);
      webSocket.close();
    };

    terminal.onKey((event) => {
      webSocket.send(msgData + Base64.stringify(Utf8.parse(event.key)), ArrayBuffer);
    });

    terminal.onResize(({ cols, rows }) => {
      webSocket.send(
        msgResize +
          Base64.stringify(
            Utf8.parse(
              JSON.stringify({
                columns: cols,
                rows: rows,
              }),
            ),
          ),
        ArrayBuffer,
      );
    });

    // 监听窗口大小变化事件
    window.addEventListener('resize', () => fitAddon.fit());
  }
});

onBeforeUnmount(() => {
  // 清理事件监听器和终端实例
  window.removeEventListener('resize', () => fitAddon.fit());
  terminal.dispose();
});
</script>

<style scoped>
.terminal-container {
  width: 100vw;
  height: 100vh;
}
</style>
