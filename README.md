# kisstate_valdi

[English Version](./README_EN.md)

**kisstate_valdi** 是一个遵循 KISS（Keep It Simple, Stupid）原则的轻量级状态管理库，面向 Valdi 组件体系。通过简洁的装饰器和响应式设计，帮助开发者轻松管理组件状态，告别复杂的状态逻辑。

---

## 特性

- **极简 API**：通过装饰器快速声明可观察对象、计算属性和监听器
- **Valdi 深度集成**：通过 `observer` 绑定组件自动响应
- **零配置**：开箱即用，仅需开启装饰器

---

## 安装

将本仓库作为 Valdi 模块依赖引入。

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

在消费方模块 `BUILD.bazel` 中添加依赖：

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

公共 API 导出在 `valdi_modules/kisstate-valdi/src/index.ts`。

---

## TypeScript 装饰器

本模块使用 legacy 装饰器。请确保消费方的 `tsconfig.json` 启用：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

---

## 核心概念

### 1. Observable Class

使用 `@ObservableClass` 声明可观察类：

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

### 2. 属性监听

使用 `@watchProps` 监听特定属性变化：

```typescript
@watchProps('age')
onAgeChange() {
  console.log('age changed:', this.age);
}
```

### 3. 计算属性

使用 `@computed` 声明自动更新的计算属性：

```typescript
@computed('age')
get nextAge() {
  return this.age + 1;
}
```

### 4. Valdi 组件绑定

直接使用 `observer` 连接 Valdi 组件：

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

## 注意事项

kisstate_valdi 不会递归深度监听子 Object 和 Array，如需变更并触发副作用，请通过解构赋值触发更新：

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

## 完整示例

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

## 工作原理

1. 通过 Proxy 进行属性访问追踪
2. 状态变更后批量调度依赖更新

---

## 最佳实践

1. 为每个领域模型创建独立的 Observable Class
2. 按业务需求拆分监听器，避免过度依赖
3. 计算属性默认缓存，避免重复计算
4. 仅在需要响应的 Valdi 组件上使用 `observer`

---

## API 文档

| API                | 说明                         |
| ------------------ | ---------------------------- |
| `@ObservableClass` | 声明可观察类                 |
| `@watchProps`      | 监听指定属性变化             |
| `@computed`        | 声明计算属性                 |
| `observer`         | 创建响应式 Valdi 组件      |

---

## License

MIT © [ailuoku6]
