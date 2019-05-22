import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, FlatList, Image, TouchableNativeFeedback, Platform,
  RefreshControl, Alert, TouchableWithoutFeedback, BackHandler, ToastAndroid, ActivityIndicator } from 'react-native';
import Permissions from 'react-native-permissions'
import Toast, {DURATION} from 'react-native-easy-toast';
import * as constants from '../constants/index';
import Icon from "react-native-vector-icons/Ionicons";
import ScenicSpotItem from "./ScenicSpotItem";
import * as request from "../fetch/index"
import httpUrl from '../constants/httpUrl';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenicList: [],
      weather: {},
      city: '宜春',
      locationPermission: '',
      loading: true,
      searchText: '',
      showEmpty: true,
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
      this.init();
    });
    this.requestPermission();
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    this._navListener.remove();
    Geolocation.clearWatch(this.watchID);
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentDidUpdate() {
  }
  
  init() {
    let searchText = this.props.navigation.state.params ? this.props.navigation.state.params.searchText : '';
    // alert(searchText && searchText != this.state.searchText?'y':'n');
    if(searchText && searchText != this.state.searchText) {
      this.setState({searchText});
      this.getScenicSpotInfo(searchText);
    }
  }

  async getHotelInfo() {
  }

  onBackAndroid = () => {
    //禁用返回键
    if(this.props.navigation.isFocused()) {//判断   该页面是否处于聚焦状态
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          //最近2秒内按过back键，可以退出应用。
          // return false;
          BackHandler.exitApp();//直接退出APP
        }else{
          this.lastBackPressed = Date.now();
          ToastAndroid.show('再按一次退出应用', 1000);//提示
          return true;
        }
    }
  }

// 获取权限
 requestPermission() {
    // alert('开始获取权限');
    Permissions.check('location', { type: 'always' }).then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response });
      setTimeout(() => {
        if(response !== 'authorized') {
          this._alertForLocationPermission();
        } else {
          this.getCityLocation();
        }
      }, 0);
    });
  }

  _requestPermission = () => {
    Permissions.request('location', { type: 'always' }).then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response }, () => {
        if(response === 'authorized') {
          this.getCityLocation();
        }
      })
    })
  }

  _alertForLocationPermission() {
    Alert.alert(
      '"旅宝"需要获取您的地理位置信息',
      '"旅宝"需要获取您的地理位置信息，以便向您推荐周边的景点信息',
      [
        {
          text: '拒绝',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        // this.state.locationPermission == 'undetermined'
        //   ? { text: '允许', onPress: this._requestPermission }
        //   : { text: '打开设置', onPress: Permissions.openSettings },
        { 
          text: '允许', 
          onPress: this._requestPermission
        },
      ],
    )
  }

  /* 
   * 获取景点信息
   */
  async getScenicSpotInfo(key) {
    const url = httpUrl.SCENE;
    const data = {
      showapi_timestamp: "",
      showapi_appid: '91427', //这里需要改成自己的appid
      showapi_sign: '1b00624b0a984e4da533b0fa8a3add28',  //这里需要改成自己的应用的密钥secret
      key: key,
      page:"1",
      pageSize:"100"
    };
    this.setState({loading: true});
    request.postData(url, data)
    .then((res) => {
      this.setState({loading: false});
      // alert('景点' + JSON.stringify(res));
      res = res.showapi_res_body;
      if(res.ret_code == 0 && res.result.length) {
        this.setState({showEmpty: false, scenicList: res.result}, () => {
          if(this.state.searchText) {
            // alert('searchText' + this.state.searchText);
            this.inverseGeocoding(this.state.scenicList[0].blocation);
          }
        });
        // this.refs.toast.show(res.msg, DURATION.LENGTH_LONG);
      } else {
        this.refs.toast.show(res.msg);
      }
    })
  }

  /* 
   * 查询天气
   */
  queryWeather(city) {
    if(city.charAt(city.length - 1) === '市') {
      city = city.substr(0, city.length - 1);
    }
    const url = httpUrl.WEATHER;
    const data = {
        city: city,
        // key: "ea784431e1695faf0d8b886d151c964a"
        version: 'v1',
    };
    request.getData(url, data)
    .then((res) => {
      this.setState({weather: res});
    })
  }

  // 获取地理位置坐标
  getCityLocation() {
    // alert('获取地理位置');
    navigator.geolocation.getCurrentPosition(
      (location) => {
        this.location = location.coords.latitude + ',' + location.coords.longitude;
        this.inverseGeocoding(location.coords.latitude + ',' + location.coords.longitude);
      },
      (error) => {
        this.refs.toast.show("获取位置失败："+ error, DURATION.LENGTH_LONG);
      }
    );
    this.watchID = navigator.geolocation.watchPosition(
      (lastLocation) => {
        this.location = lastLocation.coords.latitude + ',' + lastLocation.coords.longitude;
        this.inverseGeocoding(lastLocation.coords.latitude + ',' + lastLocation.coords.longitude);
      },
      (error) => {
        this.refs.toast.show("获取位置失败："+ error, DURATION.LENGTH_LONG);
      }
    )
  }

  // 根据坐标转换成城市,逆地理编码
  inverseGeocoding(location) {
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
            this.setState({city: res.result.addressComponent.city});
            setTimeout(() => {
              this.queryWeather(this.state.city);
              if(!this.state.searchText) {
                this.getScenicSpotInfo(this.state.city);
              }
            }, 0);
        } else {
          this.refs.toast.show('坐标转换错误码：' + res.status, DURATION.LENGTH_LONG);
        }
    })
  }

  render() {
    const {showEmpty} = this.state;
    return (
        <View style={styles.container}>
          <View style={styles.searchWrap}>
          <TouchableWithoutFeedback
            onPress={() => {
              // this.backHandler.remove();
              this.props.navigation.navigate('Search');
            }}
          >
            <View style={styles.search}>
              <Icon name="ios-search" size={24} color={constants.GRAY_DARKER} />
              <Text style={{marginLeft: 16}}>请输入城市或景点名</Text>
            </View>
          </TouchableWithoutFeedback>
            <View style={{width: "100%", flexDirection: "row", marginTop: 20, justifyContent: "space-between", alignItems: "center"}}>
              <View style={{flexDirection: "row"}}>
                <Text style={{marginRight: 8}}>{this.state.city}</Text>
                <Icon name="ios-arrow-down" size={20} color={constants.GRAY} />
              </View>
              <Text>{Object.keys(this.state.weather).length ? this.state.weather.data[0].wea+ ' ' + this.state.weather.data[0].tem: '晴 25°C'}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
          {showEmpty ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 120}}>
              <Image
                style={{width: 120, height: 120}}
                source={require('../assets/img/empty.png')}
              />
              <Text style={{marginTop: 12}}>
                亲，还没有什么内容哦~
              </Text>
              {this.state.loading && 
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
                  <ActivityIndicator size="large" color={constants.MAIN_COLOR} />
                </View>
              }
            </View>
          ) : (
            <FlatList
            data={this.state.scenicList}
            extraData={this.state}
            keyExtractor={(item) => item.scenicId}
            showsVerticalScrollIndicator = {false}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  this.queryWeather(this.state.city);
                  this.getScenicSpotInfo(this.state.searchText? this.state.searchText : this.state.city);
                }}
                refreshing={this.state.loading}
                colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
              />
            }
            ListHeaderComponent={
              () => (
                <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#fff",}}>
                  <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 30}} />
                  <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16}}>景点推荐</Text>
                </View>
              )}
            renderItem={({item}) => {
              let i = item;
                return (
                <TouchableNativeFeedback 
                  onPress={() => {
                    // this.backHandler.remove();
                    this.props.navigation.navigate('ScenicSpotDetail', {scenicSpot: i, location: i.glocation});
                  }}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <View>
                    <ScenicSpotItem
                      scenicName={item.scenicName}
                      salePrice={item.salePrice}
                      address={item.address}
                      bizTime={item.bizTime}
                      newPicUrl={item.newPicUrl}
                    />
                  </View>
                </TouchableNativeFeedback>
              )
            }
            }
          />
          )}
          </View>
          <Toast ref="toast"
            style={{backgroundColor: 'black', borderRadius: 30, opacity: 0.8, padding: 10,}}
          />
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
  searchWrap: {
    height: 120,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff"
  },
  search: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: constants.GRAY_LIGHT,
  },
  scenicSpotWrap: {
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
  }
})

export default Home;
