import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ScrollView, TextInput, 
  TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import * as constants from '../constants/index';
import formatDate from '../utils/FormatDate';
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index";
import {BoxShadow} from 'react-native-shadow';
import store from '../store/index';

const {screenWidth} = Dimensions.get('window');

function RenderImages(props) {
  const images = props.images;
  let imagesItems = images.map((item) => {
  let imgUri = httpUrl.IP + item.imgPath;
  return (
    <Image 
    key={item.id.toString()}
    resizeMode="cover"
    style={{width: "100%", minHeight: this.state.imgHeight[index]?this.state.imgHeight[index]:0, marginTop: 8,}} 
    source={{uri: imgUri}} />
  )
  })
  // imagesItems = imagesItems.slice(0,3);
  return (
    images.length? imagesItems : (null)
  )
}

function Comments(props) {
  let comments = props.comments;
  // alert(JSON.stringify(comments[0]))
  let renderComments = comments.map((item) => {
    let avatar = require('../assets/img/avatar1.png');
    return (
      <View 
        key={item.id.toString()}
        style={{flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 16,}}>
        <Image style={styles.avatar} source={avatar}/>
        <View style={{marginLeft: 12, paddingBottom: 16, borderBottomWidth: .2, borderBottomColor: constants.GRAY_LIGHTER, borderStyle: 'solid'}}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14,}}>{ item.username }</Text>
            <Text style={{color: constants.GRAY_DARKEST, width: Dimensions.get('window').width-100}}>{item.comment}</Text>
            <Text style={{color: constants.GRAY_DARK}}>{getDateDiff(item.createTime)}</Text>
        </View>
      </View>
    )
  })
  return comments.length?renderComments:(null);
}

function getDateDiff (dateTimeStamp){
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if(diffValue < 0){
    return;
  }
  var yearC = diffValue/year;
  var monthC =diffValue/month;
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;

  if(yearC>=1) {
    result="" + parseInt(yearC) + "年前";
  }
  else if(monthC>=1){
      result="" + parseInt(monthC) + "月前";
  }
  else if(weekC>=1){
      result="" + parseInt(weekC) + "周前";
  }
  else if(dayC>=1){
      result=""+ parseInt(dayC) +"天前";
  }
  else if(hourC>=1){
      result=""+ parseInt(hourC) +"小时前";
  }
  else if(minC>=1){
      result=""+ parseInt(minC) +"分钟前";
  }else
  result="刚刚";
  return result;
  }

class Strategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: [],
      comment: '',
      comments: [],
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
    this.timer = setTimeout(() => {
      this.increaseBrowseTimes();
      this.addBrowseRecord();
    }, 5000)
    this.getComment();
  }

  componentWillUnmount() {
    this._navListener.remove();
    clearTimeout(this.timer);
  }

  increaseBrowseTimes() {
    const url = httpUrl.INCREASEBROWSETIMES;
    const data = {
      noteId: this.props.navigation.state.params.travelNote.id
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        // this.setState({travelNotes: res.data.reverse()});
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  addBrowseRecord() {
    const userId = store.getState().userInfo.id;
    if(!userId) {
      return;
    }
    const url = httpUrl.ADDBROWSERECORD;
    const data = {
      userId: userId,
      noteId: this.props.navigation.state.params.travelNote.id,
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        console.log(res.msg);
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  getComment() {
    const url = httpUrl.GETCOMMENT;
    const data = {
      noteId: this.props.navigation.state.params.travelNote.id
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        // alert(JSON.stringify(res.data))
        this.setState({comments: res.data.reverse()});
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  /** 
   *  用于把用utf16编码的字符转换成实体字符，以供后台存储 * @param {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 * @return {string} 转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 
   * */
utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则 
  str = str.replace(patt, function(char) {
      var H, L, code;
      if (char.length === 2) {
          H = char.charCodeAt(0);
          // 取出高位 
          L = char.charCodeAt(1);
          // 取出低位 
          code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
          //转换算法
          return "&#" + code + ";";
      } else {
          return char;
      }
  });
  return str;
}


  sendComment() {
    const { comment } = this.state;
    if(!comment) {
      ToastAndroid.show('要输入评论内容哦~', 1000);
    }
    // alert(comment)
    const url = httpUrl.POSTCOMMENT;
    const data = {
      noteId: this.props.navigation.state.params.travelNote.id,
      comment: this.utf16toEntities(this.state.comment),
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        ToastAndroid.show(res.msg, 1000);
        this.getComment();
        this.setState({comment: '',});
        this.refs.InputText.blur();
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  render() {
    let screenWidth = Dimensions.get('window').width;
    let travelNote = this.props.navigation.state.params.travelNote;
    let avatar = require('../assets/img/avatar1.png');
    imagesItems = travelNote.images.map((item, index) => {
      let imgUri = httpUrl.IP + item.imgPath;
      return (
        <Image 
        key={item.id.toString()}
        resizeMode="cover"
        onLoadEnd={() => {
          Image.getSize(imgUri,(width, height) => {
            height = Math.floor(Number.parseInt((screenWidth - 48) * height/width, 10));
            // alert(height);
            let imgHeight = this.state.imgHeight;
            imgHeight[index] = height;
            this.setState({imgHeight});
          })
        }}
        style={{width: "100%", height: this.state.imgHeight[index]?this.state.imgHeight[index]:0, marginTop: 8,}} 
        source={{uri: imgUri}} />
      )
    })
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator = {false}
        >
        <Text style={styles.title}>{travelNote.noteTitle}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20}}>
          <Image style={styles.avatar} source={avatar}/>
          <View style={{marginLeft: 12}}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14,}}>{ travelNote.username }</Text>
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                  <Text style={{marginRight: 8}}>{`${travelNote.comments.length} 回复`}</Text>
                  <Text style={{marginRight: 8}}>|</Text>
                  {/* <Text style={{marginRight: 8}}>0 收藏</Text>
                  <Text style={{marginRight: 8}}>|</Text> */}
                  <Text style={{marginRight: 8}}>{`${travelNote.browseTimes} 次浏览`}</Text>
              </View>
              <Text style={{color: constants.GRAY_DARK}}>{formatDate("yyyy-MM-dd hh:mm:ss", travelNote.createTime)}</Text>
          </View>
        </View>
        <Text style={{color: constants.MAIN_COLOR, paddingHorizontal: 24}}>{`地区分类: ${travelNote.location}`}</Text>
        <View style={{width: "100%", height: 24, borderBottomWidth: .2, borderColor: constants.GRAY, borderStyle: "solid",}} />
        <View style={styles.body}>
          <Text style={{fontSize: 16, color: constants.GRAY_DARKEST, lineHeight: 24}}>{travelNote.noteBody}</Text>
          {/* <RenderImages images={travelNote.images} /> */}
          {imagesItems}
        </View>
        <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#fff",}}>
          <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 24}} />
          <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16, fontWeight: '700'}}>评论</Text>
        </View>
        <Comments comments={this.state.comments} />
        </ScrollView>
        <BoxShadow style={styles.bottom} setting={Object.assign({}, shadowOpt, { width: Dimensions.get('window').width, height: 50,})}>
          <View style={styles.commentWrap}>
            <TextInput
              ref={'InputText'}
              style={{width: screenWidth-120, height: 28, backgroundColor: constants.GRAY_LIGHT, paddingVertical: 0}}
              maxLength = {250}
              placeholder="随心而起，有感而发"
              onChangeText={(comment) => this.setState({comment})}
              value={this.state.comment}
            />
            <TouchableWithoutFeedback
              onPress={this.sendComment.bind(this)}>
                <View style={styles.sendBtn}>
                  <Text style={{color: "#fff",}}>发送</Text>
                </View>
            </TouchableWithoutFeedback>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

const shadowOpt = {
  color: '#000',
  border: 10,
  radius: 6,
  opacity: 0.1,
  x: 0,
  y: 2,
  // style:{marginVertical:5}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: constants.GRAY_DARKEST,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
    // backgroundColor: 'red'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  body:{
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  commentWrap: {
    width: "100%",
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  sendBtn: {
    justifyContent: 'center', 
    alignItems:'center', 
    width: 50, 
    height: 28, 
    borderRadius: 3,
    backgroundColor: constants.GREEN,
  }
  // img: {
  //   width: "100%",
  //   height: 60,
  //   marginTop: 8,
  //   resizeMode: "cover"
  // }
})

export default Strategy;