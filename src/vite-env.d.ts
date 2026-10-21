/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// PWA Virtuelle Module Typen
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // andere Umgebungsvariablen...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
