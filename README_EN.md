# kisstate_valdi

[中文版本](./README.md)

**kisstate_valdi** is a lightweight state management library built on the KISS (Keep It Simple, Stupid) principle for Valdi components. It provides a small set of decorators and a reactive model to keep state logic simple and predictable.

---

## Features

- **Minimal API**: Declare observable classes, computed values, and watchers with decorators
- **Valdi Integration**: Bind Valdi components with `observer`
- **Zero Config**: Works out of the box once decorators are enabled

---

## Installation

Add this repo as a Valdi module dependency.

```bzl
# WORKSPACE
http_archive(
    name = "kisstate_valdi",
    strip_prefix = "kisstate_valdi-<TAG>", # e.g. kisstate_valdi-beta-0.0.1
    url = "https://github.com/ailuoku6/kisstate_valdi/archive/refs/tags/<TAG>.tar.gz",
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

Add the dependency in your consumer module `BUILD.bazel`:

```bzl
valdi_module(
    name = "your_module",
    # ...
    deps = [
        "@kisstate_valdi//valdi_modules/kisstate-valdi:kisstate-valdi",
        # and optionally:
        # "@valdi_widgets//valdi_modules/navigation",
        # "@valdi_widgets//valdi_modules/valdi_standalone_ui",
    ],
)
```

Public APIs are exported from `valdi_modules/kisstate-valdi/src/index.ts`.

---

## TypeScript Decorators

This module uses legacy decorators. Ensure your consumer `tsconfig.json` enables:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

---

## Core Concepts

### 1. Observable Class

Declare an observable class with `@ObservableClass`:

```typescript
import { ObservableClass } from 'kisstate-valdi/src/kiss-valdi/index';

@ObservableClass
class User {
  name = 'jude';
  age = 26;

  constructor() {
    this.age = 17;
  }
}
```

### 2. Property Watchers

Listen to changes with `@watchProps`:

```typescript
@watchProps('age')
onAgeChange() {
  console.log('age changed:', this.age);
}
```

### 3. Computed Properties

Declare computed values with `@computed`:

```typescript
@computed('age')
get nextAge() {
  return this.age + 1;
}
```

### 4. Valdi Component Binding

Bind Valdi components directly with `observer`:

```typescript
import { observer } from 'kisstate-valdi/src/kiss-valdi/index';
import { StatefulComponent } from 'valdi_core/src/Component';

export class MyComponent extends StatefulComponent<{}, {}> {
  onRender() {
    <view>
      <label value="Hello" />
    </view>;
  }
}

export const ObservedComponent = observer(MyComponent);
```

---

## Notes

kisstate_valdi does not deeply observe nested Objects and Arrays. To trigger updates, replace them with new references:

```typescript
@ObservableClass
class User {
  skill: string[] = [];
  wallet: Record<string, unknown> = {};

  addSkill(skill: string) {
    this.skill.push(skill);
    this.skill = [...this.skill];
  }

  setWalletContent(key: string, value: unknown) {
    this.wallet[key] = value;
    this.wallet = { ...this.wallet };
  }
}
```

---

## Full Example

```typescript
import { ObservableClass, watchProps, computed, observer } from 'kisstate-valdi/src/kiss-valdi/index';
import { StatefulComponent } from 'valdi_core/src/Component';

@ObservableClass
class User {
  name = 'jude';
  age = 26;
  skill: string[] = [];
  wallet: Record<string, unknown> = {};

  constructor() {
    this.age = 17;
  }

  addSkill(skill: string) {
    this.skill.push(skill);
    this.skill = [...this.skill];
  }

  setWalletContent(key: string, value: unknown) {
    this.wallet[key] = value;
    this.wallet = { ...this.wallet };
  }

  @watchProps('age')
  onAgeChange() {
    console.log('Age changed:', this.age);
  }

  @computed('age')
  get nextAge() {
    return this.age + 1;
  }
}

const user = new User();

class App extends StatefulComponent<{}, {}> {
  onRender() {
    <view>
      <label value={`Current age: ${user.age}`} onTap={() => user.age++} />
      <label value={`Next year: ${user.nextAge}`} />
    </view>;
  }
}

export default observer(App);
```

---

## How It Works

1. Tracks property access via Proxy
2. Schedules updates when dependencies change

---

## Best Practices

1. Use one Observable Class per domain model
2. Keep watchers small and focused
3. Computed values are cached to avoid repeated work
4. Apply `observer` only where reactivity is required

---

## API Reference

| API                | Description                    |
| ------------------ | ------------------------------ |
| `@ObservableClass` | Declare an observable class    |
| `@watchProps`      | Watch specific property changes|
| `@computed`        | Declare computed values        |
| `observer`         | Create reactive Valdi components |

---

## License

MIT © [ailuoku6]
