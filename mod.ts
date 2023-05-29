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

/**
 * The type for the log level.
 * These correspond to the built-in `console` method.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Timestamp-Level-Log for Deno.
 *
 * @Example
 * ```ts
 *  const log = new Log();
 *  log.debug("debug");
 *  log.info("info", true, null);
 *  log.warn(["warning", 1, 2.4]);
 *  try {
 *    Deno.readFileSync("hello.txt");
 *  } catch (error) {
 *    log.error({error});
 *  }
 * ```
 */
export class Log {
  private datetimeFormat: string;
  private levelSign: (logLevel: LogLevel) => string;
  private suffix: string[];
  private color: boolean;

  /**
   * Log constructor.
   * @param minLogLevel [default:"debug"] Minimum level to log.
   * @param levelIndicator [default:"symbol"] Indicator type of log level.
   * @param datetimeFormat [default:"YYYY-MM-ddTHH:mm:ssZ"] Format of the timestamp. To use this, follow [the documentation of Ptera](https://tak-iwamoto.github.io/ptera/format.html).
   * @param addNewLine [default:false] Flag to add new line after the each log or not.
   * @param color [default:true] Flag to colorize the log or not.
   *
   * @Example
   * ```ts
   *  const log = new Log({ minLogLevel: "info", addNewLine: true });
   *  log.debug("This will not be displayed");
   *  log.info("System all green");
   * ```
   */
  constructor({
    minLogLevel = "debug",
    levelIndicator = "symbol",
    datetimeFormat = "YYYY-MM-ddTHH:mm:ssZ",
    addNewLine = false,
    color = true,
  }: {
    minLogLevel?: LogLevel;
    levelIndicator?: "none" | "full" | "initial" | "symbol";
    datetimeFormat?: string;
    addNewLine?: boolean;
    color?: boolean;
  } = {}) {
    for (const level of Object.keys(LOG_LEVELS) as LogLevel[]) {
      if (minLogLevel === level) break;
      this[level] = () => ({});
    }

    this.datetimeFormat = datetimeFormat;
    this.suffix = addNewLine ? ["\n"] : [];
    this.color = color;

    this.levelSign = {
      none: () => "",
      full: (logLevel: LogLevel) => " " + logLevel.toUpperCase().padEnd(5),
      initial: (logLevel: LogLevel) => " " + logLevel[0].toUpperCase(),
      symbol: (logLevel: LogLevel) => " " + LOG_LEVELS[logLevel].symbol,
    }[levelIndicator];
  }

  private prefix(date: Date, logLevel: LogLevel) {
    const timestamp = datetime(date).format(this.datetimeFormat);
    const prefix = `${timestamp}${this.levelSign(logLevel)}`.trimStart();
    if (!prefix) return [];
    if (!this.color) return [prefix];
    return [LOG_LEVELS[logLevel].color(prefix)];
  }

  private output(date: Date, logLevel: LogLevel, args: unknown[]) {
    const prefix = this.prefix(date, logLevel);
    console[logLevel](...prefix, ...args, ...this.suffix);
  }

  /**
   * Output `debug` level log with timestamp and level indicator.
   * @param args What to output.
   */
  debug(...args: unknown[]) {
    this.output(new Date(), "debug", args);
  }

  /**
   * Output `info` level log with timestamp and level indicator.
   * @param args What to output.
   */
  info(...args: unknown[]) {
    this.output(new Date(), "info", args);
  }

  /**
   * Output `warn` level log with timestamp and level indicator.
   * @param args What to output.
   */
  warn(...args: unknown[]) {
    this.output(new Date(), "warn", args);
  }

  /**
   * Output `error` level log with timestamp and level indicator.
   * @param args What to output.
   */
  error(...args: unknown[]) {
    this.output(new Date(), "error", args);
  }
}
