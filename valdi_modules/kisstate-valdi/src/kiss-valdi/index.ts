import { StatefulComponent, Component } from 'valdi_core/src/Component';
import { createValdiObserver } from './valdi/index'

// 导出核心功能（从 kiss-state-core）
export { ObservableClass, watchProps, computed } from '../kiss-state-core/src/index';
// 导出 Valdi 相关功能
export {
  type ValdiObserverConfig,
  type IBaseComponent,
} from './valdi/index';

export const observer = createValdiObserver({
  Component: Component,
  StatefulComponent: StatefulComponent,
});