import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, FlatList, 
  RefreshControl, Alert, TouchableWithoutFeedback, BackHandler, ToastAndroid } from 'react-native';
import Permissions from 'react-native-permissions'
import Toast, {DURATION} from 'react-native-easy-toast';
import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";
import ScenicSpotItem from "./ScenicSpotItem";
import * as request from "../fetch/index"

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenicList: [],
      weather: {},
      city: '北京市',
      locationPermission: '',
      loading: false,
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
      this.requestPermission();
      this.getCityLocation();
      this.queryWeather(this.state.city);
      this.getScenicSpotInfo();
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
    Geolocation.clearWatch(this.watchID);
  }

  async getHotelInfo() {
  }

  onBackAndroid = () => {
    if (this.props.navigation.state.routeName !== 'Home') {
      // navigation.navigate('Home')
      return true;
    }else {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用',1000);
      return true;
    }
  };

// 获取权限
 requestPermission() {
    Permissions.check('location', { type: 'always' }).then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response });
      setTimeout(() => {
        if(response !== 'authorized') {
          this._alertForLocationPermission();
        }
      }, 0);
    });
  }

  _requestPermission = () => {
    Permissions.request('location', { type: 'always' }).then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ locationPermission: response })
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
  async getScenicSpotInfo() {
    const url = 'http://localhost:8081/src/mock/scene.json';
    const data = {
      showapi_timestamp: "",
      showapi_appid: '91427', //这里需要改成自己的appid
      showapi_sign: '1b00624b0a984e4da533b0fa8a3add28',  //这里需要改成自己的应用的密钥secret
      key: "青岛",
      page:"1",
      pageSize:"100"
    };
    this.setState({loading: true});
    request.getData(url, data)
    .then((res) => {
      this.setState({loading: false});
      res = res.showapi_res_body;
      if(res.ret_code == 0) {
        this.setState({scenicList: res.result});
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
    // const url = "http://apis.juhe.cn/simpleWeather/query";
    const url = 'http://localhost:8081/src/mock/weather.json';
    const data = {
        city: city,
        key: "ea784431e1695faf0d8b886d151c964a"
    };
    request.getData(url, data)
    .then((res) => {
        if(res.error_code == 0) {
            this.setState({weather: res.result});
            // this.refs.toast.show(res.reason, DURATION.LENGTH_LONG);
        } else {
          this.refs.toast.show(res.reason, DURATION.LENGTH_LONG);
        }
    })
  }

  // 获取地理位置坐标
  getCityLocation() {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        this.inverseGeocoding(location.coords.latitude + ',' + location.coords.longitude);
      },
      (error) => {
        this.refs.toast.show("获取位置失败："+ error, DURATION.LENGTH_LONG);
      }
    );
    this.watchID = navigator.geolocation.watchPosition(
      (lastLocation) => {
        this.inverseGeocoding(lastLocation.coords.latitude + ',' + lastLocation.coords.longitude);
      },
      (error) => {
        this.refs.toast.show("获取位置失败："+ error, DURATION.LENGTH_LONG);
      }
    )
  }

  // 根据坐标转换成城市,逆地理编码
  inverseGeocoding(location) {
    // const url = 'http://api.map.baidu.com/geocoder/v2/';
    const url = 'http://localhost:8081/src/mock/coordinate.json';
    const data = {
        location: location,
        ak: "9lRiOAAuQeyvTckpRh88eRGhgGlvDnU1",
        output: 'json'
    };
    request.getData(url, data)
    .then((res) => {
        if(res.status === 0) {
            this.setState({city: res.result.addressComponent.city});
        } else {
          this.refs.toast.show('坐标转换错误码：' + res.status, DURATION.LENGTH_LONG);
        }
    })
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.searchWrap}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.backHandler.remove();
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
              <Text>{Object.keys(this.state.weather).length ? this.state.weather.realtime.info + ' ' + this.state.weather.realtime.temperature + '°C': '晴 25°C'}</Text>
            </View>
          </View>
          <View>
          <FlatList
            style={{marginBottom: 120}}
            data={this.state.scenicList}
            extraData={this.state}
            keyExtractor={(item) => item.scenicId}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  this.queryWeather(this.state.city);
                  this.getScenicSpotInfo();
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
            renderItem={({item}) => <ScenicSpotItem
              scenicName={item.scenicName}
              salePrice={item.salePrice}
              address={item.address}
              bizTime={item.bizTime}
              newPicUrl={item.newPicUrl}
           />}
          />
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
