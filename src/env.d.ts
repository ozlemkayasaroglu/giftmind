/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // add other VITE_... variables here as needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
