import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, FlatList, RefreshControl } from 'react-native';

import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";
import ScenicSpotItem from "./ScenicSpotItem";
import * as request from "../fetch/index"

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenicList: [],
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
    this.getScenicSpotInfo();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  async getHotelInfo() {
    // try {
    //   let response = await fetch('http://route.showapi.com/405-5', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       showapi_timestamp: "",
    //       showapi_appid: '91427', //这里需要改成自己的appid
    //       showapi_sign: '1b00624b0a984e4da533b0fa8a3add28',  //这里需要改成自己的应用的密钥secret
    //       cityId:"45",
    //       comeDate:"20161218",
    //       leaveDate:"20161219",
    //       sectionId:"",
    //       keyword:"",
    //       longitude:"",
    //       latitude:"",
    //       hbs:"",
    //       starRatedId:"",
    //       sortType:"",
    //       page:"1",
    //       pageSize:"100"
    //     }),
    //   });
    //   let responseJson = await response.json();
    //   alert(JSON.stringify(responseJson));
    // } catch {
    //   console.error(error);
    // }
  }

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
      this.setState({scenicList: res.showapi_res_body.result});
    })
  }


  render() {
    return (
        <View style={styles.container}>
          <View style={styles.searchWrap}>
            <View style={styles.search}>
              <Icon name="ios-search" size={24} color={constants.GRAY_DARKER} />
              <Text style={{marginLeft: 16}}>请输入城市或景点名</Text>
            </View>
            <View style={{width: "100%", flexDirection: "row", marginTop: 20, justifyContent: "space-between", alignItems: "center"}}>
              <View style={{flexDirection: "row"}}>
                <Text style={{marginRight: 8}}>青岛</Text>
                <Icon name="ios-arrow-down" size={20} color={constants.GRAY} />
              </View>
              <Text>晴 23</Text>
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
                  this.getScenicSpotInfo();
                }}
                refreshing={this.state.loading}
                colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
              />
            }
            ListHeaderComponent={() => <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#fff",}}>
              <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 30}} />
              <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16}}>景点推荐</Text>
            </View>}
            renderItem={({item}) => <ScenicSpotItem
              scenicName={item.scenicName}
              salePrice={item.salePrice}
              address={item.address}
              bizTime={item.bizTime}
              newPicUrl={item.newPicUrl}
           />}
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
