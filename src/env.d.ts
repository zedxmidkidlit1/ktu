/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY?: string;
  readonly OPENAI_MODEL?: string;
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  readonly SANITY_API_VERSION?: string;
  readonly SANITY_READ_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
