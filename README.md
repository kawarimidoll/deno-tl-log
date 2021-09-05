# deno-tl-log

[![ci](https://github.com/kawarimidoll/deno-tl-log/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno.land](https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

<img align="right" src="https://user-images.githubusercontent.com/8146876/132111226-d4eef47f-683b-4353-8c5a-fbd1f6314eea.png" alt="example">
<!-- assets: https://github.com/kawarimidoll/deno-tl-log/issues/1 -->

Time-Level-Log for Deno🦕

## Usage

See:
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/tl_log)

## Examples

### For Deno CLI

See [example file](examples/console.ts) or run it in your terminal.

```
deno run https://deno.land/x/tl_log/examples/console.ts
```

### For Deno Deploy

See [example file](examples/server.ts) or run it in your terminal.

```
deno run --allow-env --allow-net https://deno.land/x/tl_log/examples/server.ts
```

You can also use [deployctl](https://github.com/deno_land/deployctl).

```
deployctl run --libs="" https://deno.land/x/tl_log/examples/server.ts
```

## Motivation

Deno already has some log modules, such as [std/log](https://deno.land/std/log).

But most of the modules has the feature to write file, this will causes errors
on the Deno Deploy environments.

This module is built to not conflict with Deno Deploy API.

This module also respects the selected levels. If user call `warn`, the built-in
method `console.warn` is called.

## Prior arts

- The log colors are inspired by [std/log](https://deno.land/std/log).
- The log level indicators are inspired by
  [log_symbols](https://deno.land/x/log_symbols).
- The datetime formats are powered by [Ptera](https://deno.land/x/ptera).
