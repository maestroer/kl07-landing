import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // На кастомном домене сайт лежит в корне, на github.io — в подпапке /<repo>/.
  // Workflow подставляет нужное значение, локально остаётся '/'.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 5173, host: true },
})
