import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// reikia dotenv
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
