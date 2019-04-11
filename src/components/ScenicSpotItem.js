import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";

class ScenicSpotItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <View style={styles.container}>
          <Image
            style={{width: 120, height: 100, borderRadius: 6}}
            source={{uri: this.props.newPicUrl}}
          />
          <View style={{marginLeft: 8, height: 100, flex: 1}}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontWeight: "700", fontSize: 16}}>{this.props.scenicName}</Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{marginTop: 2}}>{this.props.address}</Text>
            <Text style={{marginTop: 2, width: 100, backgroundColor: "#F9F3ED", color: "#C78E56", fontSize: 12, paddingHorizontal: 3, borderRadius: 3, flex: 0}}>参考售价：{this.props.salePrice}</Text>
            <View style={{flexDirection: "row", width: "100%", alignItems: "center" ,position: "absolute", bottom: 5}}>
              <Icon name="md-time" size={16} color={constants.GRAY_DARK} />
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={{marginLeft: 8, color: constants.GRAY_DARK, fontSize: 12}}>{this.props.bizTime}</Text>
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
})

export default ScenicSpotItem;