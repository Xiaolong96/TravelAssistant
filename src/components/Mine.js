import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, ToastAndroid, TouchableWithoutFeedback, NativeModules, FlatList, Linking, BackHandler } from 'react-native';

import ListItem from "../common/ListItem";

import * as constants from '../constants/index';

import Icon from "react-native-vector-icons/Ionicons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AlertSelected from '../common/AlertSelected'

const nativeModule = NativeModules.OpenNativeModule;

class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.callbackSelected = this.callbackSelected.bind(this);
    this.onListItemPress = this.onListItemPress.bind(this);
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor('transparent', false);
      // this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  onJumpLogin() {
    nativeModule.openNativeVC();
  }

  onBackAndroid = () => {
    if (this.props.navigation.state.routeName !== 'Mine') {
      // navigation.navigate('Home')
      return true;
    }else {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用',1000);
      return true;
    }
  };

  showAlertSelected(){
    this.dialog.show("客服服务电话", ['17806266949'], constants.GRAY_DARKEST, this.callbackSelected);
  }
  callbackSelected(i){
    switch (i){
      case 0:
        Linking.openURL('tel:17806266949');
        break;
    }
  }

  onListItemPress(title) {
    let obj = {
      '我的收藏': 'MyCollection',
      '我的消息': 'MyCollection',
      '我的游记': 'MyCollection',
      '设置': 'MyCollection',
    }
    // alert(obj[title]);
    this.props.navigation.navigate(obj[title]);
  }

  render() {
    return (
        <View style={styles.container}>
          <View>
            <View style={{backgroundColor: constants.MAIN_COLOR, height: 100}} />
            <View style={{backgroundColor: '#fff', height: 100}} />
            <View style={styles.header}>
            <TouchableWithoutFeedback
              onPress={this.onJumpLogin}
            >
              <View style={{height: 90, width: 100, justifyContent: "space-between", alignItems: "center"}}>
                <View style={[styles.userHead, {backgroundColor: "#fff"}]}>
                  <Icon name="ios-person" size={30} color={constants.MAIN_COLOR_LIGHT} />
                </View>
                <View style={styles.userInfoWrap}>
                  <Text style={styles.userInfo}>请登录</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          </View>
          <View style={styles.funcRow}>
            <TouchableWithoutFeedback
            onPress={() => {alert('正在开发中')}}
            >
              <View style={{height: 70, alignItems: 'center', justifyContent: 'center'}}>
                <AntDesignIcon name="edit" size={24} color='#50AD6B' />
                <Text style={{color: constants.GRAY_DARKEST, fontSize: 12, paddingTop: 6}}>编辑资料</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {alert('正在开发中')}}
            >
              <View style={{height: 70, alignItems: 'center', justifyContent: 'center'}}>
                <MaterialIcons name="history" size={24} color='#06BDD5' />
                <Text style={{color: constants.GRAY_DARKEST, fontSize: 12, paddingTop: 6}}>浏览历史</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={this.showAlertSelected}
            >
              <View style={{height: 70, alignItems: 'center', justifyContent: 'center'}}>
                <AntDesignIcon name="customerservice" size={24} color='#B456BF' />
                <Text style={{color: constants.GRAY_DARKEST, fontSize: 12, paddingTop: 6}}>联系客服</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* <Image
            style={{width: "100%", height: 180}}
            source={require('../assets/img/t1.png')}
          />
          <View style={styles.header}>
            <TouchableWithoutFeedback
              onPress={this.onJumpLogin}
            >
              <View style={{height: 100, width: 100, justifyContent: "space-between", alignItems: "center"}}>
                <View style={[styles.userHead, {backgroundColor: "#fff"}]}>
                  <Icon name="ios-person" size={30} color={constants.MAIN_COLOR} />
                </View>
                <View style={styles.userInfoWrap}>
                  <Text style={styles.userInfo}>请登录</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View> */}
         <View style={{marginTop: 12, paddingBottom: 20, backgroundColor: '#fff'}}>
         <FlatList
            data={[
              {title: '我的收藏', iconColor: '#2196F3', iconName: 'ios-star'},
              {title: '我的消息', iconColor: '#F44336', iconName: 'ios-notifications'},
              {title: '我的游记', iconColor: constants.MAIN_COLOR, iconName: 'ios-journal'},
              {title: '设置', iconColor: constants.GRAY_DARK, iconName: 'ios-settings'},
            ]}
            extraData={this.state}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator = {false}
            renderItem={({item}) =>
            <TouchableWithoutFeedback
              onPress={() => {
                // alert('sdf');
                // this.backHandler.remove();
                this.onListItemPress(item.title);
              }}
            >
              <View>
              <ListItem iconColor={item.iconColor} title={item.title} iconName={item.iconName} />
              </View>
            </TouchableWithoutFeedback>
            }
          />
         </View>
         <AlertSelected ref={(dialog)=>{
            this.dialog = dialog;
          }} />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.GRAY_LIGHTER,
    // paddingBottom: 60
  },
  header: {
    position: 'absolute',
    top: 42, 
    left: 0,
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center"
  },
  userHead: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: constants.GRAY_LIGHTER
  },
  userInfoWrap: {
    justifyContent: "center",
    height: 27, 
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6, 
    backgroundColor: constants.MAIN_COLOR
  },
  userInfo: {
    color: "#fff",
    fontSize: 16,
  }, 
  funcRow: {
    height: 70,
    flexDirection: 'row', 
    justifyContent: "space-between", 
    paddingHorizontal: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 12
  }
})

export default Mine;
