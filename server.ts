/// <reference path="./deploy.d.ts" />
import { Log } from "./mod.ts";

// "DENO_DEPLOYMENT_ID" is automatically added on Deno Deploy.
// https://github.com/denoland/deploy_feedback/issues/73
// By this configuration, show all logs in local run with `deployctl`
// and "debug" log will be hidden on the Web UI.
const log = new Log({
  minLogLevel: Deno.env.get("DENO_DEPLOYMENT_ID") ? "info" : "debug",
  addNewLine: true,
});

addEventListener("fetch", (event) => {
  const { host, pathname, searchParams } = new URL(event.request.url);
  const params = Object.fromEntries([...searchParams.entries()]);

  log.debug({ host });
  log.info({ pathname, params });

  if (pathname === "/error") {
    log.error("error!");

    event.respondWith(new Response("error page!", { status: 500 }));
    return;
  }

  const message = "Hello Deno Deploy! from " + pathname;

  if (pathname.endsWith(".json")) {
    log.warn("JSON API is called");
    event.respondWith(
      new Response(JSON.stringify({ message, params }), {
        headers: { "content-type": "application/json" },
      }),
    );
    return;
  }

  event.respondWith(new Response(message));
});
