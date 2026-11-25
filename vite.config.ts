import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { VitePWA } from "vite-plugin-pwa";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAX_FILE_LABEL } from "./shared/protocol";
import { MAX_SNIPPET_LABEL } from "./shared/snippet";
import {
  DEFAULT_FRAME_BYTES,
  DEFAULT_TX_FPS,
  FRAME_BYTES_OPTIONS,
  TX_FPS_OPTIONS,
} from "./shared/send-settings";
import { htmlTokens } from "./build/html-tokens";
import { rootPwaHead } from "./build/root-pwa-head";
import { licenseBanner } from "./build/license-banner";
import { i18nPages } from "./build/i18n-pages";

// Where the site is published, used only to make the social-card URLs absolute
// — scrapers are inconsistent about resolving relative ones. Override with
// VITE_SITE_URL when deploying somewhere else; nothing else depends on it, and
// the build still works under any subpath.
const SITE_URL = process.env.VITE_SITE_URL ?? "https://decimen.app/";

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8")) as {
  version: string;
};

// Shared between the root PWA manifest and the per-locale manifests emitted
// by i18nPages() — one identity, translated descriptions.
const MANIFEST_BASE = {
  name: "Decimen Optical Transfer",
  short_name: "Decimen",
  description:
    "Send a file or text between two devices with a screen and a camera. No network.",
  theme_color: "#070a11",
  background_color: "#070a11",
  display: "standalone" as const,
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

function buildId(): string {
  const git = (cmd: string) =>
    execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  try {
    const hash = git("git rev-parse --short HEAD");
    return git("git status --porcelain").length > 0 ? `${hash}-dirty` : hash;
  } catch {
    return "production";
  }
}

/** Render a <select>'s options from the canonical lists in send-settings.ts. */
const selectOptions = (values: readonly number[], selected: number) =>
  values
    .map((v) => (v === selected ? `<option selected>${v}</option>` : `<option>${v}</option>`))
    .join("");

const TOKENS = {
  TOP_SPEED: "Up to 418 KB/s",
  MAX_FILE_LABEL,
  MAX_SNIPPET_LABEL,
  SITE_URL,
  OG_IMAGE: new URL("og.png", SITE_URL).href,
  TX_FPS_OPTIONS: selectOptions(TX_FPS_OPTIONS, DEFAULT_TX_FPS),
  FRAME_BYTES_OPTIONS: selectOptions(FRAME_BYTES_OPTIONS, DEFAULT_FRAME_BYTES),
  APP_VERSION: pkg.version,
  BUILD_ID: buildId(),
};

export default defineConfig({
  base: "./",
  plugins: [
    htmlTokens(TOKENS),
    basicSsl(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      manifest: {
        ...MANIFEST_BASE,
        start_url: "./",
      },
      workbox: {
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,wasm,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /\/received-media\//,
            handler: "CacheOnly" as const,
            options: {
              cacheName: "received-media",
              rangeRequests: true,
              matchOptions: { ignoreSearch: true },
            },
          },
        ],
      },
    }),
    rootPwaHead(),
    i18nPages({ siteUrl: SITE_URL, tokens: TOKENS, manifest: MANIFEST_BASE }),
    licenseBanner(pkg.version),
  ],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        send: resolve(__dirname, "send/index.html"),
        receive: resolve(__dirname, "receive/index.html"),
      },
    },
  },
  server: { host: true },
  preview: { host: true },
});
