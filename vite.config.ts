import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const postPreview = () => ({
  name: "post-preview-server",
  configurePreviewServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        console.log(req);
      });
    };
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), postPreview()],
});
