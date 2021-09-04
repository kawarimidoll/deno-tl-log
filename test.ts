import { assertEquals } from "./deps.ts";
import { Log, LogLevel } from "./mod.ts";

const date = new Date(2020, 9, 15, 8, 22, 45);
const datetimeFormat = "YYYY-MM-dd";
function generateLogs(log: Log) {
  const levels = ["debug", "info", "warn", "error"] as LogLevel[];
  return levels.map((level) => log.prefix(date, level));
}

Deno.test("normal", () => {
  assertEquals(
    generateLogs(new Log()),
    [
      "\x1b[0m2020-10-15T08:22:45+09:00 ✔\x1b[0m",
      "\x1b[34m2020-10-15T08:22:45+09:00 ℹ\x1b[39m",
      "\x1b[33m2020-10-15T08:22:45+09:00 ⚠\x1b[39m",
      "\x1b[31m2020-10-15T08:22:45+09:00 ✖\x1b[39m",
    ],
  );
});

Deno.test("no levels", () => {
  assertEquals(
    generateLogs(new Log({ datetimeFormat, levelIndicator: "none" })),
    [
      "\x1b[0m2020-10-15\x1b[0m",
      "\x1b[34m2020-10-15\x1b[39m",
      "\x1b[33m2020-10-15\x1b[39m",
      "\x1b[31m2020-10-15\x1b[39m",
    ],
  );
});

Deno.test("initial", () => {
  assertEquals(
    generateLogs(new Log({ datetimeFormat, levelIndicator: "initial" })),
    [
      "\x1b[0m2020-10-15 D\x1b[0m",
      "\x1b[34m2020-10-15 I\x1b[39m",
      "\x1b[33m2020-10-15 W\x1b[39m",
      "\x1b[31m2020-10-15 E\x1b[39m",
    ],
  );
});

Deno.test("full", () => {
  assertEquals(
    generateLogs(new Log({ datetimeFormat, levelIndicator: "full" })),
    [
      "\x1b[0m2020-10-15 DEBUG\x1b[0m",
      "\x1b[34m2020-10-15 INFO \x1b[39m",
      "\x1b[33m2020-10-15 WARN \x1b[39m",
      "\x1b[31m2020-10-15 ERROR\x1b[39m",
    ],
  );
});

Deno.test("no timestamp", () => {
  assertEquals(
    generateLogs(new Log({ datetimeFormat: "" })),
    [
      "\x1b[0m✔\x1b[0m",
      "\x1b[34mℹ\x1b[39m",
      "\x1b[33m⚠\x1b[39m",
      "\x1b[31m✖\x1b[39m",
    ],
  );
});
