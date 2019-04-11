import React, { Component } from 'react';
import {AppRegistry, YellowBox} from 'react-native';
import App from './src';
import { Provider } from 'react-redux';
import configureStore from './src/store';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const store = configureStore();

class myApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('MyReactNativeApp', () => myApp);

// 1b00624b0a984e4da533b0fa8a3add28
// https://www.juhe.cn/docs/api/id/73 天气查询
// https://www.showapi.com/api/view/405/5 酒店查询
