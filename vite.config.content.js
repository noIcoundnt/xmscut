import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/content',
    rollupOptions: {
      input: {
        dailyFunction: resolve(__dirname, 'dailyFunction.js'), // 如果有 content 脚本，可以添加
      },
      output: {
        entryFileNames: '[name].js',
        manualChunks: {} // 禁用代码分割，所有模块都内联进各自入口

      }
    },
    target: 'chrome112',

  }
});
