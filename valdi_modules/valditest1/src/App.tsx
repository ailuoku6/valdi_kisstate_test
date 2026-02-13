import { StatefulComponent, Component } from 'valdi_core/src/Component';
import { ImageView, Label, View } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemBoldFont, systemFont } from 'valdi_core/src/SystemFont';
import { AttributedText } from 'valdi_tsx/src/AttributedText';
import { AttributedTextBuilder } from 'valdi_core/src/utils/AttributedTextBuilder';
import { Device } from 'valdi_core/src/Device';
import { getDaemonClientManager } from 'valdi_core/src/debugging/DaemonClientManagerResolver';
import { IDaemonClientManagerListener } from 'valdi_core/src/debugging/DaemonClientManager';
import res from '../res';

import { watchProps, computed, createValdiObserver, ObservableClass } from './kiss-valdi/index';

export const observer = createValdiObserver({
  Component: Component,
  StatefulComponent: StatefulComponent,
});

@ObservableClass
class AppStoreTest {
  name = 'gy';
  age = 26;

  constructor() {
    console.log('------------test constructor');

    this.age = 17;
  }

  @watchProps('age', 'age2')
  onAgeChange() {
    console.log('---------agechange', this.age);
  }

  @computed('age', 'name')
  get age2() {
    return this.age + 1;
  }
}

const AppStoreTest1 = new AppStoreTest();

/**
 * @ViewModel
 * @ExportModel
 */
export interface AppViewModel { }

/**
 * @Context
 * @ExportModel
 */
export interface AppComponentContext { }

interface State {
  hotReloaderConnected: boolean;
}

/**
 * @Component
 * @ExportModel
 */
export class App1 extends StatefulComponent<AppViewModel, AppComponentContext> implements IDaemonClientManagerListener {
  state: State = { hotReloaderConnected: false };

  onCreate(): void {
    console.log('On App create!');
    getDaemonClientManager().addListener(this);
  }

  onDestroy(): void {
    console.log('On App destroy!');
    getDaemonClientManager().removeListener(this);
  }

  onAvailabilityChanged(available: boolean): void {
    this.setState({ hotReloaderConnected: available });
  }

  onRender(): void {
    console.log('On App render!');
    const map = new Map();
    console.info("----------fgylog ObservableClass", ObservableClass);
    map.set("test", "test value");
    <view style={styles.main}>
      <image style={styles.logo} src={res.valdi} onTap={() => AppStoreTest1.age++} />
      <layout padding={20}>
        <label style={styles.title} value={`Welcome to Valdi! ${AppStoreTest1.age}`} />
        <label style={styles.title} value={`${map.get("test")}`} />
      </layout>
      <label style={styles.subtitle} value={this.renderLabel()} />
    </view>;
  }

  private renderLabel(): AttributedText {
    const textBuilder = new AttributedTextBuilder();

    textBuilder.appendText('This is currently running on ');
    textBuilder.appendStyled({
      content: this.getPlatformString(),
      attributes: {
        color: 'red',
        font: systemBoldFont(20),
      },
    });

    textBuilder.appendText('\nHot reloader ');
    if (this.state.hotReloaderConnected) {
      textBuilder.appendStyled({
        content: 'connected',
        attributes: {
          color: 'green',
          font: systemBoldFont(20),
        },
      });
    } else {
      textBuilder.appendStyled({
        content: 'disconnected',
        attributes: {
          color: 'red',
          font: systemBoldFont(20),
        },
      });
    }

    return textBuilder.build();
  }

  private getPlatformString(): string {
    if (Device.isDesktop()) {
      return 'Desktop';
    } else if (Device.isIOS()) {
      return 'iOS';
    } else if (Device.isAndroid()) {
      return 'Android';
    } else {
      return 'Unknown';
    }
  }
}

export const App = observer(App1);

const styles = {
  main: new Style<View>({
    backgroundColor: 'white',
    justifyContent: 'center',
  }),
  logo: new Style<ImageView>({
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 16,
    boxShadow: '0 0 3 rgba(0, 0, 0, 0.15)',
  }),
  title: new Style<Label>({
    color: 'black',
    font: systemBoldFont(24),
    accessibilityCategory: 'header',
    alignSelf: 'center',
  }),

  subtitle: new Style<Label>({
    alignSelf: 'center',
    color: 'black',
    font: systemFont(20),
    numberOfLines: 0,
    textAlign: 'center',
  }),
};
