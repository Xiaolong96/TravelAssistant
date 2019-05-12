import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, TextInput, ToastAndroid } from 'react-native';
import * as constants from '../constants/index';
import * as request from "../fetch/index"
import httpUrl from '../constants/httpUrl';

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
        passwordOld: '',
        passwordNew: '',
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

  componentDidMount() {
   
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  complete() {
    if(!this.state.passwordOld || !this.state.passwordNew) {
      ToastAndroid.show('请检查输入是否完整', 1000);
      return;
    }
    const url = httpUrl.RESET_PASSWORD;
    const data = {
      passwordOld: this.state.passwordOld,
      passwordNew: this.state.passwordNew,
    }
    request.postData(url, data)
    .then((res) => {
      // alert(JSON.stringify(res))
      if(res.status == 0) {
        ToastAndroid.show(res.msg, 1000);
        this.props.navigation.goBack();
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableWithoutFeedback
              onPress = {() => this.props.navigation.goBack()}>
              <View style={{width: 40, height: 40, justifyContent: 'center',}}>
                <Text>取消</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress = {this.complete.bind(this)}>
              <View style={styles.btn}>
                <Text style={{color: constants.WHITE}}>完成</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.title}>
                <Text style={{fontSize: 16, color: constants.GRAY_DARKEST, fontWeight: "700"}}>修改用户密码</Text>
            </View>
        </View>
        <View style={{height: 50, backgroundColor: "#fff",paddingHorizontal: 16, marginBottom: 8}}>
            <TextInput
                style={{width: "100%", height: "100%",}}
                placeholder={'请输入旧密码'}
                secureTextEntry={true}
                onChangeText={(passwordOld) => this.setState({passwordOld})}
                value={this.state.passwordOld}
            />
        </View>
        <View style={{height: 50, backgroundColor: "#fff",paddingHorizontal: 16}}>
            <TextInput
                style={{width: "100%", height: "100%",}}
                placeholder={'请输入新密码'}
                secureTextEntry={true}
                onChangeText={(passwordNew) => this.setState({passwordNew})}
                value={this.state.passwordNew}
            />
        </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.GRAY_LIGHTER,
    marginTop: 20
  },
  header: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: constants.GRAY_LIGHTER,
  },
  title: {
    position: "absolute",
    top: 0,
    left: 50,
    bottom: 0,
    right: 50,
    justifyContent: "center",
    alignItems: 'center',
    // transform: [{translateY: "-50%"}, {translateX: "-50%"}]
  },
  btn: {
      width: 50, 
      height: 28, 
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      backgroundColor: constants.GREEN,
  }
})

export default UpdatePassword;