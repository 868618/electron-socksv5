/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 是否是真的退出
   */
  VITE_PUB_IS_REAL_QUIT: boolean

  VITE_PUB_TEST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
