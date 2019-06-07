import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import * as constants from '../constants/index';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import httpUrl from '../constants/httpUrl';

const {width} = Dimensions.get('window');
const IMG_WIDTH = (width - 96) / 3;

function RenderImages(props) {
  const images = props.images;
  let imagesItems = images.map((item) => 
    <Image 
      key={item.id.toString()}
      style={[styles.img, {resizeMode: 'cover'}]} 
      source={{uri: httpUrl.IP + item.imgPath}} />
  )
  imagesItems = imagesItems.slice(0,3);
  return (
    images.length? imagesItems : (null)
  )
}


class TravelNote extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const { travelNote } = this.props;
    let avatar = require('../assets/img/avatar1.png');
    return (
        <View style={styles.container}>
          <View style={{justifyContent: 'flex-start', height: "100%"}}>
            <Image style={styles.avatar} source={avatar}/>
          </View>
          <View style={{marginLeft: 8}}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14, fontWeight: '800', marginBottom: 14}}>{ travelNote.username }</Text>
            <Text numberOfLines={3} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14, width: width -80, marginBottom: 12}}>{travelNote.noteTitle}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 12}}>
              <RenderImages images={travelNote.images} />
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',}}>
              <Text style={{fontSize: 12}}>{`${travelNote.browseTimes} 次浏览`}</Text>
              <View style={{justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{maxWidth: 120, marginRight: 16, fontSize: 12}}>{this.getDateDiff(travelNote.createTime)}</Text>
                <View style={{justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center',}}>
                  <Icon name="comment-processing-outline" size={16} color={constants.GRAY_DARK} />
                  <Text style={{marginLeft: 4, fontSize: 12}}>{travelNote.comments.length}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: .2,
    borderColor: constants.GRAY,
    borderStyle: "solid",
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  img: {
    width: IMG_WIDTH,
    height: IMG_WIDTH,
    marginRight: 8,
  }
})

export default TravelNote;