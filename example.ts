import { Log } from "./mod.ts";

const log = new Log();
log.debug("debug");
log.info("info", true, null);
log.warn(["warning", 1, 2.4]);
try {
  Deno.readFileSync("not-exist.txt");
} catch (error) {
  log.error({ error });
}
