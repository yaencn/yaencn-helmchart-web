interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_CHARTS_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
