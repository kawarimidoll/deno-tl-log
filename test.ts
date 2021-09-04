import { assertEquals } from "./deps.ts";
import { Log, LogLevel } from "./mod.ts";

const levels = ["debug", "info", "warn", "error"] as LogLevel[];

const date = new Date(2020, 9, 6, 8, 2, 45);
function generateLogPrefixes(log: Log) {
  return levels.map((level) => log._prefix(date, level));
}

Deno.test("normal", () => {
  assertEquals(
    generateLogPrefixes(new Log()),
    [
      ["\x1b[0m2020-10-06T08:02:45+09:00 ✔\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45+09:00 ℹ\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45+09:00 ⚠\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45+09:00 ✖\x1b[39m"],
    ],
  );
});

Deno.test("no levels", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "none" })),
    [
      ["\x1b[0m2020-10-06T08:02:45+09:00\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45+09:00\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45+09:00\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45+09:00\x1b[39m"],
    ],
  );
});

Deno.test("initial", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "initial" })),
    [
      ["\x1b[0m2020-10-06T08:02:45+09:00 D\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45+09:00 I\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45+09:00 W\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45+09:00 E\x1b[39m"],
    ],
  );
});

Deno.test("full", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "full" })),
    [
      ["\x1b[0m2020-10-06T08:02:45+09:00 DEBUG\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45+09:00 INFO \x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45+09:00 WARN \x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45+09:00 ERROR\x1b[39m"],
    ],
  );
});

Deno.test("change datetime format", () => {
  assertEquals(
    generateLogPrefixes(new Log({ datetimeFormat: "MMM, d, YYYY, h:m a" })),
    [
      ["\x1b[0mOct, 6, 2020, 8:2 AM ✔\x1b[0m"],
      ["\x1b[34mOct, 6, 2020, 8:2 AM ℹ\x1b[39m"],
      ["\x1b[33mOct, 6, 2020, 8:2 AM ⚠\x1b[39m"],
      ["\x1b[31mOct, 6, 2020, 8:2 AM ✖\x1b[39m"],
    ],
  );
});

Deno.test("no timestamp", () => {
  assertEquals(
    generateLogPrefixes(new Log({ datetimeFormat: "" })),
    [
      ["\x1b[0m✔\x1b[0m"],
      ["\x1b[34mℹ\x1b[39m"],
      ["\x1b[33m⚠\x1b[39m"],
      ["\x1b[31m✖\x1b[39m"],
    ],
  );
});

function collectConsoleArgs(log: Log) {
  const result: unknown[] = [];
  levels.forEach((level) => {
    // stub console
    console[level] = (...args: unknown[]) => {
      result.push(args);
    };
    log[level](level);
  });
  return result;
}

Deno.test("add newline", () => {
  assertEquals(
    collectConsoleArgs(new Log({ datetimeFormat: "", addNewLine: true })),
    [
      ["\x1b[0m✔\x1b[0m", "debug", "\n"],
      ["\x1b[34mℹ\x1b[39m", "info", "\n"],
      ["\x1b[33m⚠\x1b[39m", "warn", "\n"],
      ["\x1b[31m✖\x1b[39m", "error", "\n"],
    ],
  );
});

Deno.test("minimum level", () => {
  assertEquals(
    collectConsoleArgs(new Log({ datetimeFormat: "", minLogLevel: "warn" })),
    [
      ["\x1b[33m⚠\x1b[39m", "warn"],
      ["\x1b[31m✖\x1b[39m", "error"],
    ],
  );
});

Deno.test("no prefix", () => {
  assertEquals(
    collectConsoleArgs(new Log({ datetimeFormat: "", levelIndicator: "none" })),
    [
      ["debug"],
      ["info"],
      ["warn"],
      ["error"],
    ],
  );
});
