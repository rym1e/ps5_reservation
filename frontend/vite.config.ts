import { defineConfig } from 'vite';
import rawUni from '@dcloudio/vite-plugin-uni';
import path from 'path';

const uni = typeof rawUni === 'function' ? rawUni : rawUni.default;

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0'
  }
});
