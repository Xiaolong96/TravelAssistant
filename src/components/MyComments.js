import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Dimensions, ToastAndroid, RefreshControl,
  FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import * as constants from '../constants/index';
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index"
import store from '../store/index';

import TitleBar from '../common/TitleBar';




class MyNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      news: [],
    };
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor(constants.GRAY_LIGHTER);
    });
    this.getNews();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  getNews() {
    const url = httpUrl.GETMYCOMMENT;
    this.setState({loading: true});
    request.postData(url)
    .then((res) => {
      this.setState({loading: false});
      if(res.status == 0) {
        this.setState({news: res.data.reverse()});
        // alert(JSON.stringify(myNews));
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  onNewPress(noteId) {
    const url = httpUrl.GETTRAVELNOET;
    const data = {
      noteId: noteId,
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        this.props.navigation.navigate('TravelNoteDetail', {travelNote: res.data})
        // alert(JSON.stringify(myNews));
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  getDateDiff (dateTimeStamp){
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

  render() {
    const userInfo = store.getState().userInfo;
    let avatar;
    if(userInfo.id%2 == 1) {
      avatar = require('../assets/img/avatar1.png');
    } else {
      avatar = require('../assets/img/avatar2.png');
    }
    return (
      <View style={styles.container}>
        <TitleBar title="我的评论" callback={() => this.props.navigation.goBack()}/>
        <FlatList
          data={this.state.news}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator = {false}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                this.getNews();
              }}
              refreshing={this.state.loading}
              colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
            />
          }
          renderItem={({item}) => {
            let i = item;
              return (
                <TouchableWithoutFeedback
                  onPress={this.onNewPress.bind(this, item.noteId)}>
                  <View 
                    style={{flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 16,}}>
                    <Image style={styles.avatar} source={avatar}/>
                    <View style={{marginLeft: 12, paddingBottom: 16, borderBottomWidth: .2, borderBottomColor: constants.GRAY, borderStyle: 'solid'}}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14,}}>{ item.username }</Text>
                        <Text style={{color: constants.GRAY_DARKEST, width: Dimensions.get('window').width-100}}>{item.comment}</Text>
                        <Text style={{color: constants.GRAY_DARK}}>{this.getDateDiff(item.createTime)}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            }
          }
        />
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
})

export default MyNews;
