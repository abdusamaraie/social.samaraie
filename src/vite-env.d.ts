/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_URL?: string
  readonly VITE_AUTH_REDIRECT_URL?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_PWA?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}