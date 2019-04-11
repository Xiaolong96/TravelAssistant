import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, StatusBar, TouchableWithoutFeedback, NativeModules, FlatList } from 'react-native';

import ListItem from "../common/ListItem";

import * as constants from '../constants/index';

import Icon from "react-native-vector-icons/Ionicons";

const nativeModule = NativeModules.OpenNativeModule;

class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor('transparent', false);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  onJumpLogin() {
    nativeModule.openNativeVC();
  }

  render() {
    return (
        <View style={styles.container}>
          <Image
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
          </View>
          <FlatList
            style={{marginTop: 12, paddingBottom: 20,}}
            data={[
              {title: 'Devin', iconColor: constants.MAIN_COLOR},
              {title: 'Jackson', iconColor: constants.MAIN_COLOR},
              {title: 'James', iconColor: constants.MAIN_COLOR},
              {title: 'Joel', iconColor: constants.MAIN_COLOR},
              {title: 'John', iconColor: constants.MAIN_COLOR},
              {title: 'Jillian', iconColor: constants.MAIN_COLOR},
              {title: 'Jimmy', iconColor: constants.MAIN_COLOR},
              {title: 'Julie', iconColor: constants.MAIN_COLOR},
            ]}
            extraData={this.state}
            keyExtractor={(item) => item.title}
            renderItem={({item}) => <ListItem iconColor={item.iconColor} title={item.title} />}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.GRAY_LIGHTER,
  },
  header: {
    position: 'absolute',
    top: 20, 
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
  }
})

export default Mine;