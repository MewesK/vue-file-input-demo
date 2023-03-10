import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { Form } from "multiparty";
import { inspect } from "node:util";

import type { Connect, ViteDevServer } from "vite";
import type { ServerResponse } from "node:http";

const postPreview = () => ({
  name: "post-preview-middleware",
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      (req: Connect.IncomingMessage, res: ServerResponse, next: Function) => {
        if (req.method === "POST") {
          console.warn(`Received POST request for URL "${req.url}"`);

          const form = new Form();
          form.parse(req, (err: Error, fields: any, files: any) => {
            // Console logging
            console.log(
              inspect({ fields: fields, files: files }, false, 3, true)
            );

            // Debug response
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(inspect({ fields: fields, files: files }, false, 3, false));
          });
        } else { 
          next();
        }
      }
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), postPreview()],
});
