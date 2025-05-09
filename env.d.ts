/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 是否是真的退出
   */
  VITE_PUB_IS_REAL_QUIT: boolean
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
