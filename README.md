# valditest1 (Valdi module)
This repo provides a reusable Valdi module at `valdi_modules/valditest1` so other projects can depend on it.

## Use in Another Valdi Project

Add this repo to your consumer project's `WORKSPACE` using either `http_archive` (recommended for shared use) or `local_repository` (for local dev).

```bzl
# WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "valditest1",
    # Replace with your repo URL and tag/commit
    url = "https://github.com/<org>/valditest1/archive/refs/heads/main.zip",
    strip_prefix = "valditest1-main",
)
```

```bzl
# WORKSPACE (local dev alternative)
load("@bazel_tools//tools/build_defs/repo:local.bzl", "local_repository")

local_repository(
    name = "valditest1",
    path = "/absolute/path/to/valditest1",
)
```

Then add the module dependency in your consumer module `BUILD.bazel`:

```bzl
valdi_module(
    name = "your_module",
    # ...
    deps = [
        "@valditest1//valdi_modules/valditest1:valditest1",
    ],
)
```

Public APIs are exported from `valdi_modules/valditest1/src/index.ts`.

## Local Development (Optional)

All commands requires `valdi` to be available on PATH.

Get auto completion in VSCode
```sh
valdi projectsync
```

Build and install iOS:
```sh
valdi install ios
```

Build and install Android:
```sh
valdi install android
```

Build and install MacOS:
```sh
valdi install macos
```

Start hot reloader:
```sh
valdi hotreload
```
