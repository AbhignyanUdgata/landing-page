import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url));

function asyncStyles() {
  return {
    name: "async-styles",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="(\.\/assets\/[^"]+\.css)"([^>]*?)>/g,
        (_match, pre, href, post) =>
          `<link rel="preload" as="style"${pre}href="${href}"${post} onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet"${pre}href="${href}"${post}></noscript>`
      );
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), asyncStyles()],
  build: {
    rollupOptions: {
      input: {
        index: page("index"),
        work: page("work"),
        about: page("about"),
        legal: page("legal"),
        notFound: page("404"),
      },
    },
  },
});
