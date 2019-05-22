import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, ScrollView, } from 'react-native';
import * as constants from '../constants/index';
import Rating from '../common/Rating';
import Icon from "react-native-vector-icons/Ionicons";



class AroundDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: [],
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
    // alert(JSON.stringify(this.props.navigation.state.params.aroundInfo))
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  formatDistance (dis) {
    if(Number.parseInt(dis, 10) > 1000) {
        return `${(dis/1000).toFixed(1)} 公里`;
    } else {
        return dis + ' 米';
    }
  }


  render() {
    let screenWidth = Dimensions.get('window').width;
    let aroundInfo = this.props.navigation.state.params.aroundInfo;
    imagesItems = aroundInfo.photos.map((item, index) => {
      return (
        <Image 
        key={index.toString()}
        resizeMode="cover"
        onLoadEnd={() => {
          Image.getSize(item.url,(width, height) => {
            height = Math.floor(Number.parseInt((screenWidth - 48) * height/width, 10));
            // alert(height);
            let imgHeight = this.state.imgHeight;
            imgHeight[index] = height;
            this.setState({imgHeight});
          })
        }}
        style={{width: "100%", height: this.state.imgHeight[index]?this.state.imgHeight[index]:0, marginTop: 8,}} 
        source={{uri: item.url}} />
      )
    })
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator = {false}
        >
        <Text style={styles.title}>{aroundInfo.name}</Text>

        <View style={{paddingHorizontal: 16}}>
            <Rating rating={aroundInfo.biz_ext.rating.constructor === Array? 0 : aroundInfo.biz_ext.rating } />

            <View style={styles.intro}>
                <Text style={{marginRight: 16, fontWeight: '700'}}>分类</Text>
                <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 114}}>{aroundInfo.type}</Text>
            </View>
            <View style={styles.intro}>
                <Text style={{marginRight: 16, fontWeight: '700'}}>联系方式</Text>
                <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 114}}>{aroundInfo.tel?aroundInfo.tel: '暂无'}</Text>
            </View>
            <View style={styles.intro}>
                <Text style={{marginRight: 16, fontWeight: '700'}}>经纬度坐标</Text>
                <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 130}}>{aroundInfo.location}</Text>
            </View>
            <View style={styles.intro}>
                <Text style={{marginRight: 16, fontWeight: '700'}}>与此距离</Text>
                <Text style={{flexWrap: 'wrap', width: Dimensions.get('window').width - 114}}>{this.formatDistance(aroundInfo.distance)}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
            <Icon name="md-pin" size={20} color={constants.MAIN_COLOR} />
            <Text style={{marginLeft: 8}}>{aroundInfo.pname + aroundInfo.cityname + aroundInfo.adname + aroundInfo.address}</Text>
          </View>

        <View style={styles.body}>
        <View style={{flexDirection: "row", alignItems: "center", paddingBottom: 16, backgroundColor: "#fff",}}>
           <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 24}} />
           <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16, fontWeight: '700'}}>展示图片</Text>
         </View>
           {imagesItems}
         </View>
         </ScrollView>
      </View>
    );
  }
}


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
  intro: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
  },
})

export default AroundDetail;