import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, TextInput, ToastAndroid } from 'react-native';
import * as constants from '../constants/index';
import * as request from "../fetch/index"
import httpUrl from '../constants/httpUrl';
import { updateUserInfo } from '../store/actions/updateUserInfo';
import store from '../store/index';

class EditText extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: '',
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
    const val = this.props.navigation.state.params.val;
    if(val) {
        this.setState({text: val});
    }
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  complete() {
    if(!this.state.text) {
      ToastAndroid.show('亲，输入不能为空哦~', 1000);
      return;
    }
    const params = this.props.navigation.state.params;
    if(this.state.text === params.val){
      ToastAndroid.show('亲，未做出修改哦~', 1000);
      return;
    }
    const url = httpUrl.UPDATE_INFORMATION;
    const data = {}
    data[params.key] = this.state.text;
    // alert(JSON.stringify(data))
    request.postData(url, data)
    .then((res) => {
      // alert(JSON.stringify(res))
      if(res.status == 0) {
        store.dispatch(updateUserInfo(data));
        this.props.navigation.navigate('Mine');
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
                <Text style={{fontSize: 16, color: constants.GRAY_DARKEST, fontWeight: "700"}}>设置名字</Text>
            </View>
        </View>
        <View style={{height: 50, backgroundColor: "#fff",paddingHorizontal: 16}}>
            <TextInput
                style={{width: "100%", height: "100%",}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
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

export default EditText;