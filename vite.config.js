import path from 'path';
import { defineConfig } from 'vite';

const srcPath = path.resolve('./src');
const distPath = path.relative(srcPath, './dist');

export default defineConfig({
  root: srcPath,
  resolve: {
    alias: {
      '~': srcPath
    }
  },
  build: {
    outDir: distPath,
    emptyOutDir: true
  },
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': 'https://ha-slutuppgift-chat-do.westling.workers.dev',
    }
  }
});
