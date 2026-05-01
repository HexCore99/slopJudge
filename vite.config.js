import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { Server } from "lucide-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),

    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5999",
      "/auth": "http://localhost:5999",
      "/contests": "http://localhost:5999",
      "/problems": "http://localhost:5999",
    },
  },
});
