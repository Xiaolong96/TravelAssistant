import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, NativeModules, ToastAndroid, ActivityIndicator } from 'react-native';
import * as constants from '../constants/index';
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index"

import TitleBar from '../common/TitleBar';

import { doLogout } from '../store/actions/logout';
import store from '../store/index';

const nativeModule = NativeModules.OpenNativeModule;


class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false
    };
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor(constants.GRAY_LIGHTER);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  switchAccount() {
    nativeModule.openNativeVC();
  }

  logout() {
    const url = httpUrl.LOGOUT;
  // alert(url)
    this.setState({loading: true});
    request.postData(url)
    .then((res) => {
      this.setState({loading: false});
      // alert(JSON.stringify(res))
      if(res.status == 0) {
        if(store.getState().userInfo.username){
          store.dispatch(doLogout());
          ToastAndroid.show('注销成功', 1000);
        } else {
          ToastAndroid.show('未登录', 1000);
        }

      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
            <TitleBar title="设置" callback={() => this.props.navigation.goBack()}/>
            <TouchableWithoutFeedback
                onPress={this.switchAccount.bind(this)}>
                <View style={styles.item}>
                    <Text>切换账号</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPress={this.logout.bind(this)}>
                <View style={styles.item}>
                    <Text>退出登录</Text>
                </View>
            </TouchableWithoutFeedback>
            {this.state.loading && 
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
                  <ActivityIndicator size="large" color={constants.MAIN_COLOR} />
                </View>
              }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: constants.GRAY_LIGHTER,
  },
  item: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: .2,
    borderBottomWidth: .2,
    borderColor: constants.GRAY,
    borderStyle: "solid",
    marginBottom: 8,
  }
})

export default Setting;
