import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete GuruMeet landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /GuruMeet/);
  assert.match(html, /何食べる？/);
  assert.match(html, /全員でスワイプするだけ/);
  assert.match(html, /決めるまで、たった3ステップ/);
  assert.match(html, /今日のご飯/);
  assert.match(html, /og:image/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("keeps SEO routes and image fallbacks in place", async () => {
  const [robotsResponse, sitemapResponse, pageSource] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
    readFile(new URL("../components/landing-page.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);
  assert.match(await robotsResponse.text(), /User-Agent:\s*\*/i);
  assert.match(await sitemapResponse.text(), /gurumeet\.pages\.dev/);
  assert.match(pageSource, /onError=/);
  assert.match(pageSource, /prefers-reduced-motion|useReducedMotion/);
});
