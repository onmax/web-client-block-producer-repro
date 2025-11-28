import { copyFile, cp, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'

function copyComlinkPlugin() {
  return {
    name: 'copy-comlink-worker-dependency',
    apply: 'build',
    async closeBundle() {
      const publicDir = fileURLToPath(new URL('./public', import.meta.url))
      const distDir = fileURLToPath(new URL('./dist', import.meta.url))
      const distAssetsDir = path.join(distDir, 'assets')
      const src = path.join(publicDir, 'comlink.min.js')
      const dest = path.join(distAssetsDir, 'comlink.min.js')

      await mkdir(distAssetsDir, { recursive: true })
      await copyFile(src, dest)

      const workerSrcDir = path.join(distDir, 'worker-wasm')
      const workerDestDir = path.join(distAssetsDir, 'worker-wasm')
      await cp(workerSrcDir, workerDestDir, { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [
    wasm(),
    copyComlinkPlugin(),
  ],
  worker: {
    format: 'es',
    plugins: () => [wasm()],
  },
  optimizeDeps: {
    exclude: ['@nimiq/core'],
  },
})
