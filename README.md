# kisstate-valdi (Valdi module)
This repo provides a reusable Valdi module at `valdi_modules/kisstate-valdi` so other projects can depend on it.

## Use in Another Valdi Project

Add this repo to your consumer project's `WORKSPACE` using either `http_archive` (recommended for shared use) or `local_repository` (for local dev).

```bzl
# WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "kisstate_valdi",
    # Replace with your repo URL and tag/commit
    url = "https://github.com/<org>/kisstate-valdi/archive/refs/heads/main.zip",
    strip_prefix = "kisstate-valdi-main",
)
```

```bzl
# WORKSPACE (local dev alternative)
load("@bazel_tools//tools/build_defs/repo:local.bzl", "local_repository")

local_repository(
    name = "kisstate_valdi",
    path = "/absolute/path/to/kisstate-valdi",
)
```

Then add the module dependency in your consumer module `BUILD.bazel`:

```bzl
valdi_module(
    name = "your_module",
    # ...
    deps = [
        "@kisstate_valdi//valdi_modules/kisstate-valdi:kisstate-valdi",
    ],
)
```

Public APIs are exported from `valdi_modules/kisstate-valdi/src/index.ts`.

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
