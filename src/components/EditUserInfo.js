import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, NativeModules, ToastAndroid, ActivityIndicator } from 'react-native';
import * as constants from '../constants/index';
import Icon from "react-native-vector-icons/Ionicons";
import formatDate from '../utils/FormatDate';
import TitleBar from '../common/TitleBar';

import store from '../store/index';



class EditUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor(constants.GRAY_LIGHTER);
    });
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  onNameEidt() {
    this.props.navigation.navigate('EditText', {
      key: 'username',
      val: store.getState().userInfo.username,
    });
  }
  
  render() {
    const userInfo = store.getState().userInfo;
    return (
        <View style={styles.container}>
            <TitleBar title="我的资料" callback={() => this.props.navigation.goBack()}/>
            <TouchableWithoutFeedback
                onPress={this.onNameEidt.bind(this)}>
                <View style={styles.item}>
                    <Text>昵称</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{maxWidth: 180, color: constants.GRAY_DARK, marginRight: 8,}}>{userInfo.username}</Text>
                        <Icon name="ios-arrow-forward" size={20} color={constants.GRAY_DARK} />
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => {this.props.navigation.navigate('UpdatePassword')}}>
                <View style={styles.item}>
                    <Text>修改密码</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{maxWidth: 180, color: constants.GRAY_DARK, marginRight: 8,}}>点击修改</Text>
                        <Icon name="ios-arrow-forward" size={20} color={constants.GRAY_DARK} />
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => {ToastAndroid.show('注册手机号无法修改', 1000);}}>
                <View style={styles.item}>
                    <Text>手机号</Text>
                    <View>
                        <Text style={{color: constants.GRAY_DARK, marginRight: 8,}}>{userInfo.phone}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => {ToastAndroid.show('注册时间无法修改', 1000);}}>
                <View style={styles.item}>
                    <Text>注册时间</Text>
                    <View>
                        <Text style={{color: constants.GRAY_DARK, marginRight: 8,}}>{formatDate("yyyy-MM-dd hh:mm:ss", userInfo.createTime)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPress={() => {ToastAndroid.show('资料修改时间无法修改', 1000);}}>
                <View style={styles.item}>
                    <Text>资料修改时间</Text>
                    <View>
                        <Text style={{color: constants.GRAY_DARK, marginRight: 8,}}>{formatDate("yyyy-MM-dd hh:mm:ss", userInfo.updateTime)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#fff",
    // borderTopWidth: .2,
    // borderBottomWidth: .2,
    // borderColor: constants.GRAY,
    // borderStyle: "solid",
    paddingHorizontal: 16,
    marginBottom: 8,
  }
})

export default EditUserInfo;
