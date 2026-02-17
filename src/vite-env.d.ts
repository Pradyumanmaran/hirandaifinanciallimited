/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_X_TENANT_DOMAIN: string;

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
