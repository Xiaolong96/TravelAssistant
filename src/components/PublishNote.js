import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, TextInput, 
  ToastAndroid, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import * as constants from '../constants/index';
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import httpUrl from '../constants/httpUrl';
import CountEmitter from '../utils/CountEmitter'

const { width, height } = Dimensions.get('window');
const IMG_WIDTH = (width - 88) / 4;



class PublishNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
        noteTitle: '',
        noteBody: '',
        location: '',
        images: [],
        loading: false,
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      includeBase64: true,
    }).then(images => {
      this.setState((preState) => ({
        images: preState.images.concat(images.map(i => {
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }))
      }));
    }).catch(e => alert(e));
  }

  // publishNote() {
  //   const url = httpUrl.PUBLISHNOTE;
  //   const data = {};
  //   this.setState({loading: true});
  //   request.postData(url, data)
  //   .then((res) => {
  //     this.setState({loading: false});
  //     // alert(JSON.stringify(res))
  //     if(res.status == 0) {
  //       // TODO 触发更新监听
  //       this.props.navigation.navigate('Strategy');
  //       ToastAndroid.show(res.msg, 1000);
  //     } else {
  //       ToastAndroid.show(res.msg, 1000);
  //     }
  //   })
  // }

  publishNote() {
    const { noteTitle, noteBody, location } = this.state;
    if (!noteTitle || !noteBody) {
      ToastAndroid.show('亲，标题和正文不能为空哦~', 1000);
      return;
    }
    let formData = new FormData();
    if(!this.state.images.length){
        console.log("没有选择图片");
    } else {
        for(var i = 0;i<this.state.images.length;i++){
            var uri = this.state.images[i].uri;
            var index = uri.lastIndexOf("\/");
            var name  = uri.substring(index + 1, uri.length);
            let file = {uri: uri, type: 'multipart/form-data', name: name } ;
            console.log(JSON.stringify(file))
            formData.append('file', file);
        }
    }

    // 上传图片时，可以在此添加相关其他参数
    formData.append('noteTitle', noteTitle);
    formData.append('noteBody', noteBody);
    formData.append('location', location?location: '未知');

    console.log("formData          " + JSON.stringify(formData));

    this.setState({loading: true});
    const url = httpUrl.PUBLISHNOTE;
    fetch(url, {
        method:'POST',
        credentials:'include',
        headers:{
            'Content-Type':'multipart/form-data',
            'Accept': 'application/json'
        },
        body: formData,
    }).then((response) => response.json()).then((responseJson) => {
        this.setState({loading: false});
        // alert(JSON.stringify(responseJson));
        if (responseJson.status == 0) {
          // TODO 触发更新监听
          CountEmitter.emit('updateTravelNote');
          this.props.navigation.goBack();
          ToastAndroid.show(responseJson.msg, 1000);
        }else{
          ToastAndroid.show(responseJson.msg, 1000);
        }
    }).catch((error) => {
        this.setState({loading: false});
        // ToastAndroid.show(error, 1000);
        console.log(error);
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.goBack()}>
              <View>
              <Icon name="md-arrow-back" size={24} color={constants.GRAY_DARKEST} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={{color: constants.GRAY_DARKEST, fontSize: 18, fontWeight: '700', marginLeft: 12,}}>发布游记</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={this.publishNote.bind(this)}>
              <View>
              <Icon name="ios-paper-plane" size={24} color={constants.GRAY_DARKEST} />
              </View>
            </TouchableWithoutFeedback>
        </View>
        <View style={{height: 60 , marginHorizontal: 16, borderBottomWidth: .2, borderColor: constants.GRAY, borderStyle: 'solid'}}>
            <TextInput
                style={{width: "100%", height: "100%", fontWeight: '500'}}
                placeholder={'游记标题 (最多50字)'}
                maxLength = {50}
                onChangeText={(noteTitle) => this.setState({noteTitle})}
                value={this.state.noteTitle}
            />
        </View>
        <View style={{height: 46 , marginHorizontal: 16, borderBottomWidth: .2, borderColor: constants.MAIN_COLOR_LIGHT, borderStyle: 'solid'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: constants.MAIN_COLOR}}>地区分类</Text>
            <TextInput
                style={{width: "100%", height: "100%", color: constants.MAIN_COLOR, marginLeft: 12}}
                maxLength = {20}
                onChangeText={(location) => this.setState({location})}
                value={this.state.location}
            />
          </View>
        </View>
        <View style={{marginHorizontal: 16, marginTop: 12, paddingBottom: 120}}>
            <TextInput
                style={{width: "100%", maxHeight: height - 280}}
                placeholder={'写下你的游记'}
                multiline = {true}
                onChangeText={(noteBody) => this.setState({noteBody})}
                value={this.state.noteBody}
            />
        </View>

        <View style={styles.camera}>
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator = {false}
            data={this.state.images}
            extraData={this.state}
            keyExtractor={(item) => item.uri}
            renderItem={({item, index}) => (
              <View style={{borderRadius: 2, marginRight: 8, overflow: 'hidden'}}>
                <Image style={{width: IMG_WIDTH, height: IMG_WIDTH, resizeMode: 'cover'}} 
                source={{uri: item.uri}} />
              </View>
            )}
          />
        <TouchableWithoutFeedback
          onPress={this.pickMultiple.bind(this)}>
          <View style={{borderRadius: 2, width: IMG_WIDTH, height: IMG_WIDTH, backgroundColor: constants.GRAY_LIGHT, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="ios-camera" size={30} color={constants.GRAY} />
          </View>
        </TouchableWithoutFeedback>
        </View>
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
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      paddingHorizontal: 16,
  },
  camera: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row'
  }
})

export default PublishNote;