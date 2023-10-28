import { Log } from "../mod.ts";

// "DENO_DEPLOYMENT_ID" is automatically added on Deno Deploy.
// https://github.com/denoland/deploy_feedback/issues/73
// By this configuration, show all logs in local run with `deployctl`
// and "debug" log will be hidden on the Web UI.
const log = new Log({
  minLogLevel: Deno.env.get("DENO_DEPLOYMENT_ID") ? "info" : "debug",
  addNewLine: true,
});

Deno.serve((request: Request) => {
  const { host, pathname, searchParams } = new URL(request.url);
  const params = Object.fromEntries([...searchParams.entries()]);

  log.debug({ host });
  log.info({ pathname, params });

  if (pathname === "/error") {
    log.error("error!");

    return new Response("error page!", { status: 500 });
  }

  if (pathname.endsWith(".json")) {
    log.warn("JSON API is called");
    return new Response(JSON.stringify({ pathname, params }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    `<!DOCTYPE html><html><head><title>tl-log example</title></head>
    <body>
      <div>Hello from ${pathname}.</div>
      <div>
        <p>Try to access these links to show the logs.</p>
        <ul>
          <li><a href="/test">/test</a></li>
          <li><a href="/test.json">/test.json</a></li>
          <li><a href="/error">/error</a></li>
        </ul>
      </div>
    </body></html>`,
    {
      headers: { "content-type": "text/html" },
    },
  );
});
