import { assertEquals } from "@std/assert";
import { Log, LogLevel } from "./mod.ts";

const levels = ["debug", "info", "warn", "error"] as LogLevel[];

const date = new Date(2020, 9, 6, 8, 2, 45);
function generateLogPrefixes(log: Log) {
  // deno-lint-ignore no-explicit-any
  return levels.map((level) => (log as any).prefix(date, level));
}

Deno.test("normal", () => {
  assertEquals(
    generateLogPrefixes(new Log()),
    [
      ["\x1b[0m2020-10-06T08:02:45 ✔\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45 ℹ\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45 ⚠\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45 ✖\x1b[39m"],
    ],
  );
});

Deno.test("no color", () => {
  assertEquals(
    generateLogPrefixes(new Log({ color: false })),
    [
      ["2020-10-06T08:02:45 ✔"],
      ["2020-10-06T08:02:45 ℹ"],
      ["2020-10-06T08:02:45 ⚠"],
      ["2020-10-06T08:02:45 ✖"],
    ],
  );
});

Deno.test("no levels", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "none" })),
    [
      ["\x1b[0m2020-10-06T08:02:45\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45\x1b[39m"],
    ],
  );
});

Deno.test("initial", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "initial" })),
    [
      ["\x1b[0m2020-10-06T08:02:45 D\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45 I\x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45 W\x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45 E\x1b[39m"],
    ],
  );
});

Deno.test("full", () => {
  assertEquals(
    generateLogPrefixes(new Log({ levelIndicator: "full" })),
    [
      ["\x1b[0m2020-10-06T08:02:45 DEBUG\x1b[0m"],
      ["\x1b[34m2020-10-06T08:02:45 INFO \x1b[39m"],
      ["\x1b[33m2020-10-06T08:02:45 WARN \x1b[39m"],
      ["\x1b[31m2020-10-06T08:02:45 ERROR\x1b[39m"],
    ],
  );
});

Deno.test("change datetime format", () => {
  assertEquals(
    generateLogPrefixes(new Log({ datetimeFormat: "yyyy/MM/dd h:m a" })),
    [
      ["\x1b[0m2020/10/06 8:2 AM ✔\x1b[0m"],
      ["\x1b[34m2020/10/06 8:2 AM ℹ\x1b[39m"],
      ["\x1b[33m2020/10/06 8:2 AM ⚠\x1b[39m"],
      ["\x1b[31m2020/10/06 8:2 AM ✖\x1b[39m"],
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
