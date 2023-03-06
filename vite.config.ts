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
          console.warn("URL: ", req.url);

          const form = new Form();
          form.parse(req, function (err, fields, files) {
            const debugOutput = inspect({ fields: fields, files: files }, false, 3);;

            // Console logging
            console.log("Form data:", debugOutput);

            // Debug response
            res.writeHead(200, { "content-type": "text/plain" });
            res.write("Form data:\n\n");
            res.end(debugOutput);
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
