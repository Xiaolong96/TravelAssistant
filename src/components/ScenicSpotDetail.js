import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, StatusBar, Dimensions, FlatList, ScrollView,
   TouchableWithoutFeedback, ToastAndroid, ActivityIndicator } from 'react-native';
import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";
import {BoxShadow} from 'react-native-shadow';
import { MapView, Marker } from 'react-native-amap3d'
import * as util from '../utils/index'
import AlertSelected from '../common/AlertSelected'
import CardList from '../common/CardList';
import * as request from "../fetch/index"
import httpUrl from '../constants/httpUrl';

const selectedArr = ["高德地图", "百度地图"];


class ScenicSpotDetail extends Component {
  constructor(props) {
    super(props);
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.callbackSelected = this.callbackSelected.bind(this);
    this.state = {
      isShowTicket: false,
      loading: false,
      AroundInfo: {
        hotelData: [],
        sceneData: [],
        foodData: [],
      },
      weather: {},
    };
  }

  componentWillMount() {
    this.scenicSpot = this.props.navigation.state.params.scenicSpot;
    this.location = this.props.navigation.state.params.location;
    // alert(JSON.stringify(this.scenicSpot));
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
    // this.scenicSpot = this.props.navigation.state.params.scenicSpot;
    this.queryNearbyInfo(this.location.split(',').reverse().join(','));
    this.getWeatherInfo(this.scenicSpot.blocation);
  }

  getWeatherInfo(location) {
    const url = httpUrl.COORDINATE;
    const data = {
        location: location,
        ak: "9lRiOAAuQeyvTckpRh88eRGhgGlvDnU1",
        output: 'json'
    };
    request.getData(url, data)
    .then((res) => {
        if(!res) {
          return;
        }
        if(res.status === 0) {
          let district = res.result.addressComponent.district
          district = district.substr(0, district.length - 1);
          const weaData = {
              city: district,
              version: 'v1',
          };
          request.getData(httpUrl.WEATHER, weaData)
          .then((res) => {
            this.setState({weather: res});
          })
        } else {
          // this.refs.toast.show('天气查询失败：' + res.status, DURATION.LENGTH_LONG);
        }
    })
  }

  FormatCoordinate(coord) {
    return coord.split(',').map((item) => parseFloat(item));
  }

  showAlertSelected(){
    this.dialog.show("请选择地图App", selectedArr, constants.MAIN_COLOR, this.callbackSelected);
  }

  callbackSelected(i){
    switch (i){
        case 0:
            util.turn2MapApp(this.location.split(',').reverse().join(','), this.FormatCoordinate(this.scenicSpot.glocation)[1], this.FormatCoordinate(this.scenicSpot.glocation)[0], 'gaode', this.scenicSpot.scenicName)
            break;
        case 1:
            util.turn2MapApp(this.location, this.FormatCoordinate(this.scenicSpot.glocation)[1], this.FormatCoordinate(this.scenicSpot.glocation)[0], 'baidu', this.scenicSpot.scenicName)
            break;
    }
  }

  // 查询附近信息
  queryNearbyInfo(coord) {
    const url = httpUrl.AROUND;
    const data = {
      key: 'e9fa5a85f0dda1b4e0a123b3c97a0b05',
      keywords: '酒店|旅店',
      location: coord,
      radius: 10000,
      sortrule: 'weight',
      page: 1,
      offset: 15,// 每页不超过25条数据
      output: 'JSON'
    }
    let q1 = request.getData(url, data);
    let q2 = request.getData(url, Object.assign({}, data, {keywords: '景点', radius: 30000}));
    let q3 = request.getData(url, Object.assign({}, data, {keywords: '美食'}));
    this.setState({loading: true});
    let hotelData,sceneData,foodData;
    Promise.all([q1, q2, q3]).then((res) => {
      this.setState({loading: false});
      res.forEach((item, index) => {
        if(item.status === '1') {
          switch(index.toString()) {
            case '0': 
              hotelData = item.pois;
              // this.setState({hotelData: item.pois});
              break;
            case '1': 
              sceneData = item.pois;
              // this.setState({sceneData: item.pois});
              break;
            case '2': 
              foodData = item.pois;
              // this.setState({foodData: item.pois});
              break;
          }
        } else {
          ToastAndroid.show(item.info, 1000);
        }
      })
      const AroundInfo = {
        hotelData,
        sceneData,
        foodData,
      }
      this.setState({AroundInfo});
      // alert(JSON.stringify(AroundInfo));
    })
    // request.getData(url, data)
    //   .then((res) => {
    //     if(res.status === '1') {
    //       this.setState({hotelData: res.pois})
    //     }else {
    //       ToastAndroid.show(res.info, 1000);
    //     }
    //   })
    // request.getData(url, Object.assign({}, data, {keywords: '景点', radius: 30000}))
    //   .then((res) => {
    //     if(res.status === '1') {
    //       this.setState({sceneData: res.pois})
    //     }else {
    //       ToastAndroid.show(res.info, 1000);
    //     }
    //   })
    // request.getData(url, Object.assign({}, data, {keywords: '美食'}))
    //   .then((res) => {
    //     if(res.status === '1') {
    //       this.setState({foodData: res.pois})
    //     }else {
    //       ToastAndroid.show(res.info, 1000);
    //     }
    //   })
  }

  render() {
    return (
      <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator = {false}
      >
        <View style={styles.container}>
          <View style={styles.imageWrap}>
            <BoxShadow setting={Object.assign({}, shadowOpt, { width: Dimensions.get('window').width - 24, height: 160,})}>
              <Image
                style={{width: "100%", height: 160, borderRadius: 6}}
                source={{uri: this.scenicSpot.newPicUrl}}
              />
            </BoxShadow>
          </View>
          <View style={{backgroundColor: '#fff', padding: 16, paddingTop: 0}}>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <View style={{width: Dimensions.get('window').width - 100}}>
                <Text style={{fontSize: 18, fontWeight: "700", color: constants.GRAY_DARKEST}}>{this.scenicSpot.scenicName}</Text>
              </View>
              <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
                <View style={styles.separator}/>
                <View style={{justifyContent: 'space-around', alignItems: 'center'}}>
                  <Icon name="ios-star" size={20} color={constants.MAIN_COLOR} />
                  <Text style={{color: constants.MAIN_COLOR, fontSize: 12}}>收藏</Text>
                </View>
              </View>
            </View>
            <Text style={{marginTop: 8}}>山雄奇秀拔，云雾缭绕，山中多飞泉瀑布和奇洞怪石，名胜古迹遍布，夏天气候凉爽宜人，是我国著名的旅游风景区和避暑疗养胜地，于1996年被列入“世界自然与文化遗产名录”。</Text>
            <View style={styles.intro}>
              <Text style={{marginRight: 16, fontWeight: '700'}}>开放时间</Text>
              <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 114}}>{this.scenicSpot.bizTime}</Text>
            </View>
            <View style={styles.intro}>
              <Text style={{marginRight: 16, fontWeight: '700'}}>经纬度坐标</Text>
              <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 130}}>{this.scenicSpot.glocation}</Text>
            </View>
            <View style={styles.intro}>
              <Text style={{marginRight: 16, fontWeight: '700'}}>天气</Text>
              <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 200}}>
                {JSON.stringify(this.state.weather)=='{}'? '晴 25°C':this.state.weather.city + ' ' + this.state.weather.data[0].wea + ' ' + this.state.weather.data[0].tem}
              </Text>
              <View style={{position: 'absolute',right: 0,}}>
              <TouchableWithoutFeedback
              onPress = {() => {this.props.navigation.navigate('WeatherDetail',{weather: this.state.weather})}}>
              <View style={styles.btn}>
                <Text style={{color: constants.WHITE}}>详情</Text>
              </View>
            </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
          <View style={{marginHorizontal: 12, paddingTop: 12}}>
            <BoxShadow setting={Object.assign({}, shadowOpt, { width: Dimensions.get('window').width - 24, height: this.state.isShowTicket? 40 + this.scenicSpot.dis_list.length * 60 : 40, border: 6})}>
              <View style={{backgroundColor: '#fff', borderRadius: 6}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({isShowTicket: !this.state.isShowTicket});
                }}
              >
                <View style={styles.card}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="ios-card" size={20} color={constants.BLUE_LIGHT} />
                      <Text style={{marginLeft: 8}}>景点门票</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{marginRight: 12, color: constants.GRAY}}>{this.scenicSpot.dis_list.length}</Text>
                      {
                        this.state.isShowTicket ? (
                          <Icon name="ios-arrow-up" size={20} color={constants.GRAY} />
                        ) : (
                          <Icon name="ios-arrow-down" size={20} color={constants.GRAY} />
                        )
                      }
                    </View>
                  </View>
              </TouchableWithoutFeedback>
                {
                  this.state.isShowTicket && 
                  <FlatList
                    data={this.scenicSpot.dis_list}
                    extraData={this.state}
                    keyExtractor={(item) => item.productName}
                    showsVerticalScrollIndicator = {false}
                    renderItem={({item}) =>
                      (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, paddingHorizontal: 16}}>
                          <Text numberOfLines={3} ellipsizeMode={'tail'} style={{width: Dimensions.get('window').width - 170}}>{item.productName}</Text>
                          <Text style={{marginTop: 2, width: 100, backgroundColor: "#F9F3ED", color: "#C78E56", fontSize: 12, paddingHorizontal: 3, borderRadius: 3, flex: 0}}>参考售价：{item.salePrice}</Text>
                        </View>
                      )
                    }
                  />
                }
                </View>
            </BoxShadow>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
            <Icon name="md-pin" size={20} color={constants.MAIN_COLOR} />
            <Text style={{marginLeft: 8}}>{this.scenicSpot.address}</Text>
          </View>
          <View style={{alignItems: 'center', borderRadius: 6}}>
            <BoxShadow 
              setting={Object.assign({}, shadowOpt, { width: Dimensions.get('window').width - 32, height: 120, border: 6})}>
              <TouchableWithoutFeedback
                onPress={() => {this.props.navigation.navigate('Map', { coord: {
                  lat: this.FormatCoordinate(this.scenicSpot.glocation)[0],
                  lon: this.FormatCoordinate(this.scenicSpot.glocation)[1],
                  name: this.scenicSpot.scenicName,
                }
                })}}
              >
                <View style={{borderRadius: 6, overflow: 'hidden'}}>
                <MapView
                  style={{height: "100%", width: "100%"}}
                  coordinate={{
                    latitude: this.FormatCoordinate(this.scenicSpot.glocation)[0],
                    longitude: this.FormatCoordinate(this.scenicSpot.glocation)[1],
                  }}
                  showsZoomControls={false}
                  zoomEnabled={false}
                  scrollEnabled={false}
                >
                <Marker
                  color='red' 
                  coordinate={{
                    latitude: this.FormatCoordinate(this.scenicSpot.glocation)[0],
                    longitude: this.FormatCoordinate(this.scenicSpot.glocation)[1],
                  }}
                />
                </MapView>
                <TouchableWithoutFeedback
                    onPress={() => {
                      // alert(this.FormatCoordinate(this.scenicSpot.glocation)[0]);
                      this.showAlertSelected();
                    }
                    }
                >
                <View style={styles.navigation}>
                  <Text style={{color: constants.MAIN_COLOR}}>路线规划</Text>
                </View>
                </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </BoxShadow>
          </View>
          <CardList cardTitle="附近旅店" data={this.state.AroundInfo.hotelData} onjump={(item) => {this.props.navigation.navigate('AroundDetail', {aroundInfo: item})}}/>
          <TouchableWithoutFeedback
            onPress={() => {alert('暂不提供更多信息')}}
          >
            <View style={{alignItems: 'center', justifyContent: 'center',padding: 12}}>
              <Text style={{color: constants.MAIN_COLOR, fontSize: 14}}>查看更多附近旅店 ></Text>
            </View>
          </TouchableWithoutFeedback>
          <CardList cardTitle="附近景点" data={this.state.AroundInfo.sceneData} onjump={(item) => {this.props.navigation.navigate('AroundDetail', {aroundInfo: item})}}/>
          <TouchableWithoutFeedback
            onPress={() => {alert('暂不提供更多信息')}}
          >
            <View style={{alignItems: 'center', justifyContent: 'center',padding: 12}}>
              <Text style={{color: constants.MAIN_COLOR, fontSize: 14}}>查看更多附近景点 ></Text>
            </View>
          </TouchableWithoutFeedback>
          <CardList cardTitle="附近美食" data={this.state.AroundInfo.foodData} onjump={(item) => {this.props.navigation.navigate('AroundDetail', {aroundInfo: item})}}/>
          <TouchableWithoutFeedback
            onPress={() => {alert('暂不提供更多信息')}}
          >
            <View style={{alignItems: 'center', justifyContent: 'center',padding: 12}}>
              <Text style={{color: constants.MAIN_COLOR, fontSize: 14}}>查看更多附近美食 ></Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
      <AlertSelected ref={(dialog)=>{
            this.dialog = dialog;
        }} />
        {this.state.loading && 
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
            <ActivityIndicator size="large" color={constants.MAIN_COLOR} />
          </View>
        }
      </View>
    );
  }
}

//样式
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
    backgroundColor: constants.GRAY_LIGHTER,
    paddingTop: 26,
    paddingBottom: 20
    // padding: 12,
  },
  imageWrap: {
    backgroundColor: constants.WHITE,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16
  },
  separator: {
    height: 50,
    backgroundColor: constants.GRAY,
    width: 1,
    marginRight: 16,
  },
  intro: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  card: {
    height: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right:0,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
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

export default ScenicSpotDetail;