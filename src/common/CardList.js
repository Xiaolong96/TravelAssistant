import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
// import {BoxShadow} from 'react-native-shadow';
import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";
import Rating from '../common/Rating';

class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatDistance (dis) {
    if(Number.parseInt(dis, 10) > 1000) {
        return `${(dis/1000).toFixed(1)} 公里`;
    } else {
        return dis + ' 米';
    }
  }

  _renderItem = ({item, index}) => (
    <View style={{width: 140, marginVertical: 16, marginLeft: index=='0'? 16: 8, marginRight: index=='19'? 16: 8}}>
        {/* <BoxShadow setting={Object.assign({}, shadowOpt, { width: 140, height: 210})}> */}
        <TouchableWithoutFeedback
          onPress={() => {this.props.onjump(item)}}>
          <View style={{borderRadius: 6, width: 140, overflow: 'hidden'}}>
            {item.photos.length?(
              <Image
                style={{width: "100%", height: 120}}
                source={{uri: item.photos[0].url}}
              />
            ):(
              <View style={{width: 140}}>
              <Image
                style={{width: "100%", height: 120}}
                source={require('../assets/img/avatar2.png')}
              />
              <View style={{position:'absolute', left:0, top:0, right:0, height: 120,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(0,0,0,0.2)', zIndex:9}}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight:'700'}}>
                  暂无图片
                </Text>
              </View>
              </View>
            )}
            <View style={{backgroundColor: '#fff', height: 90}}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>{item.name}</Text>
              <Rating rating={item.biz_ext.rating.constructor === Array? 0 : item.biz_ext.rating } />
              <Text style={{paddingHorizontal: 8, paddingVertical: 3, fontSize: 12, color: constants.GRAY_DARK}}>
                  {this.formatDistance(item.distance)}
              </Text>
            </View>
            </View>
        </TouchableWithoutFeedback>
        {/* </BoxShadow> */}
    </View>
  );

  render() {
    let data = this.props.data;
    if(data.length === 0) {
      return null;
    }
    // alert(JSON.stringify(data));
    return (
        <View style={styles.container}>
          <View style={{flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 0}}>
            <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 30}} />
            <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16}}>{this.props.cardTitle}</Text>
          </View>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator = {false}
            data={data}
            extraData={this.props}
            keyExtractor={(item) => item.id}
            renderItem={this._renderItem}
          />
        </View>
    );
  }
}

// const shadowOpt = {
//     color: '#000',
//     border: 10,
//     radius: 6,
//     opacity: 0.1,
//     x: 0,
//     y: 2,
//     // style:{marginVertical:5}
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
  },
  title: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: constants.GRAY_DARKEST,
    fontSize: 14,
  }
})

export default CardList;