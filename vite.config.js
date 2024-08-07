import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
// monaco
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    envDir: './env',
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: mode === 'dev',
        logger: false,
        supportTs: true,
      }),
      vueJsx(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue', 'mock/**/*.js'],
      }),
      monacoEditorPlugin({
        languages: [
          'javascript',
          'typescript',
          'yaml',
          'html',
          'css',
          'json',
          'java',
          'sql',
          'groovy',
          'shell',
          'python',
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        // 分文件打包，减小单个js文件的大小
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
    // 新增打包配置去除多余的console和debugger
    esbuild: {
      drop: ['console', 'debugger'],
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    server: {
      host: 'localhost',
      port: 8080,
      hmr: true,
      usePolling: true,
      // open: true, // 设置服务启动时是否自动打开浏览器
    },
  });
