import React, { Component } from 'react';
import {AppRegistry, YellowBox, BackHandler, ToastAndroid} from 'react-native';
import App from './src';
import { Provider } from 'react-redux';
import store from './src/store';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


class myApp extends Component {
  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
}
componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
}


onBackAndroid = () => {
  //禁用返回键
  if(this.props.navigation.isFocused()){//判断   该页面是否处于聚焦状态
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          BackHandler.exitApp();//直接退出APP
      }else{
          this.lastBackPressed = Date.now();
          ToastAndroid.show('再按一次退出应用', 1000);//提示
          return true;
      }
  }
}

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
