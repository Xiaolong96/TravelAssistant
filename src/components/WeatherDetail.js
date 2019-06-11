import React, { Component } from 'react';
import { Text, View, ImageBackground, SafeAreaView, StyleSheet, StatusBar, RefreshControl, ScrollView, TouchableWithoutFeedback } from 'react-native';
import * as constants from '../constants/index';



class WeatherDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isRefreshing: false,
    };
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor('transparent', false);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

//   _onRefresh = () => {
//     this.setState({
//         isRefreshing: true
//     });
//     setTimeout(() => {
//         this.setState({
//             isRefreshing: false
//         })
//     }, 5000);
// }

  render() {
    const weather = this.props.navigation.state.params.weather;
    return (
        <ImageBackground style={styles.container}
        source={require('../assets/img/bg.png')}
        >
            <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
            <View style={{marginTop: 25,}}>
                <View style={styles.topbox}>
                    <View style={styles.placeBox}>
                        <Text style={styles.topbox_text1}>{weather.city?weather.city:'北京'}</Text>
                    </View>
                    <Text style={styles.topbox_text2}>{weather.data[0].tem?weather.data[0].tem:'25℃'}</Text>
                    <Text style={styles.topbox_text3}>{weather.data[0].wea?weather.data[0].wea:'晴'}</Text>
                </View>
                <View style={styles.topbox2}>
                    <Text style={styles.topbox2_text1}>空气质量: {weather.data[0].air_level?weather.data[0].air_level:'优'}</Text>
                    <Text style={styles.topbox2_text2}>风力: {weather.data[0].win_speed?weather.data[0].win_speed:'<3级'}</Text>
                </View>
            </View>
            <View style={styles.totalbox}>
                {weather.data.length !== 0&&weather.data.map((infor, i) => {
                    let weatherDiv =(
                        <View style={styles.list} key={"forecast-list" + i}>
                            <View style={styles.list1}>
                                <Text style={styles.list_date}>{infor&&infor.day}</Text>
                            </View>
                            <View style={styles.list2}>
                                <Text style={styles.list_weather}>{infor&&infor.wea}</Text>
                            </View>
                            <View style={styles.list3}>
                                <Text style={styles.list_tmp}>{infor&&infor.tem2}~{infor&&infor.tem1}</Text>
                            </View>
                        </View>
                    );
                    return weatherDiv
                })}
            </View>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.boxList}>
                        <View style={styles.blankBox}></View>
                        <Text style={styles.Suggest_title}>今日生活指数</Text>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>紫外线指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[0].level ? weather.data[0].index[0].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[0].desc ? weather.data[0].index[0].desc: '暂无'}</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>减肥指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[1].level ? weather.data[0].index[1].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[1].desc ? weather.data[0].index[1].desc: '暂无'}</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>血糖指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[2].level ? weather.data[0].index[2].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[2].desc ? weather.data[0].index[2].desc: '暂无'}</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>穿衣指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[3].level ? weather.data[0].index[3].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[3].desc ? weather.data[0].index[3].desc: '暂无'}</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>洗车指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[4].level ? weather.data[0].index[4].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[4].desc ? weather.data[0].index[4].desc: '暂无'}</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.box1}>
                                <Text style={styles.text1}>空气污染扩散指数:</Text>
                                <Text style={styles.text1}>{weather.data[0].index[5].level ? weather.data[0].index[5].level: '暂无'}</Text>
                            </View>
                            <Text style={styles.description}>{weather.data[0].index[5].desc ? weather.data[0].index[5].desc: '暂无'}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            </SafeAreaView>
            
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    height: '100%'
  },
  boxList:{
      marginTop:"1%",
      paddingBottom: 20,
    },
    blankBox:{height:20,width:"100%",backgroundColor:"rgba(0,0,0,0.3)"},
    Suggest_title:{color:"white",marginTop:"4%",paddingLeft:"4%",},
    box:{borderBottomWidth:1,borderColor: '#4a4a4a',paddingTop:"4%",paddingBottom:"1%"},
    box1:{
        flexDirection:"row",
        marginTop:"1%"
    },
    text1:{
        color:"white",
        paddingRight:"4%",
        paddingLeft:"4%",
        fontWeight:"bold",
        paddingBottom:"1%"
    },
    description:{
        color:"#f0f0f0",
        paddingRight:"4%",
        paddingLeft:"4%",
    },
    topbox:{
        color:"white",
        justifyContent:"center",
        alignItems: 'center',
    },
    topbox_text1:{
        color:"white",
        fontSize:26
    },
    topbox_text2:{
        color:"white",
        fontSize:46
    },
    topbox_text3:{
        color:"white",
        fontSize:18
    },
    placeBox:{flexDirection:"row"},
    add_icon:{color:"white",marginRight:"1%"},
    topbox2:{
        flexDirection:"row",
        paddingLeft:"10%",
        paddingRight:"10%",
        marginTop:"10%"
    },
    topbox2_text1:{
        color:"white",
        width:"40%",
        marginRight:"20%"
    },
    topbox2_text2:{
        color:"white",
        width:"40%"
    },
    totalbox:{
        color:"white",
        // justifyContent:"center",
        // alignItems: 'center',
    },
    list:{
        paddingLeft:"5%",
        paddingRight:"5%",
        marginTop:"5%",
        width:'100%',
        flexDirection:"row",
    },
    list1:{
        flexDirection:"row",
        width:"35%",
        justifyContent: 'flex-start',
        // height:"30%",
        alignItems: 'center',
        marginRight:"5%"
    },
    list2:{
        flexDirection:"row",
        width:"30%",
        // height:"30%",
        alignItems: 'center',
        // marginRight:"5%"
    },
    list3:{
        flexDirection:"row",
        justifyContent: 'flex-end',
        width:"30%",
        // height:"30%",
        alignItems: 'center'
    },
    list_date:{
        color:"white"
    },
    list_day:{
        color:"white",
        // marginLeft:"2%"
    },
    list_weather:{
        color:"white",
        // marginLeft:"2%"
    },
    list_tmp:{
        color:"white",
    },
})

export default WeatherDetail;
