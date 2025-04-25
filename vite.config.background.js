import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/background',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'background.js'),  // 假设你写在项目根目录
      },
      output: {
        entryFileNames: '[name].js',
        manualChunks: {} // 禁用代码分割，所有模块都内联进各自入口

      }
    },
    target: 'chrome112',

  }
});
