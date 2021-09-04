import { blue, datetime, red, reset, yellow } from "./deps.ts";

const LOG_LEVELS = {
  debug: {
    color: reset,
    symbol: "✔",
  },
  info: {
    color: blue,
    symbol: "ℹ",
  },
  warn: {
    color: yellow,
    symbol: "⚠",
  },
  error: {
    color: red,
    symbol: "✖",
  },
};

export type LogLevel = keyof typeof LOG_LEVELS;

export class Log {
  readonly datetimeFormat: string;
  private levelSign: (logLevel: LogLevel) => string;
  private suffix: string;

  constructor({
    minLogLevel = "debug",
    levelIndicator = "symbol",
    datetimeFormat = "YYYY-MM-ddTHH:mm:ssZ",
    addNewLine = false,
  }: {
    minLogLevel?: LogLevel;
    levelIndicator?: "none" | "full" | "initial" | "symbol";
    datetimeFormat?: string;
    addNewLine?: boolean;
  } = {}) {
    for (const level of Object.keys(LOG_LEVELS) as LogLevel[]) {
      if (minLogLevel === level) break;
      this[level] = () => ({});
    }

    this.datetimeFormat = datetimeFormat;
    this.suffix = addNewLine ? "\n" : "";

    this.levelSign = {
      none: () => "",
      full: (logLevel: LogLevel) => " " + logLevel.toUpperCase().padEnd(5),
      initial: (logLevel: LogLevel) => " " + logLevel[0].toUpperCase(),
      symbol: (logLevel: LogLevel) => " " + LOG_LEVELS[logLevel].symbol,
    }[levelIndicator];
  }

  output(date: Date, logLevel: LogLevel, msg: unknown[]) {
    const prefix = LOG_LEVELS[logLevel].color(
      `${datetime(date).format(this.datetimeFormat)}${this.levelSign(logLevel)}`
        .trimStart(),
    );

    console[logLevel](prefix, ...msg, this.suffix);
  }

  debug(...msg: unknown[]) {
    this.output(new Date(), "debug", msg);
  }
  info(...msg: unknown[]) {
    this.output(new Date(), "info", msg);
  }
  warn(...msg: unknown[]) {
    this.output(new Date(), "warn", msg);
  }
  error(...msg: unknown[]) {
    this.output(new Date(), "error", msg);
  }
}
