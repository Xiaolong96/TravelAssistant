import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import * as constants from '../constants/index';


class TitleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
              onPress = {this.props.callback}>
              <View style={{width: 40, height: 40, justifyContent: 'center',}}>
                <Icon name="ios-arrow-back" size={20} color={constants.GRAY_DARKEST} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.title}>
                <Text style={{fontSize: 16, color: constants.GRAY_DARKEST, fontWeight: "700"}}>{this.props.title}</Text>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: constants.GRAY_LIGHTER,
  },
  title: {
    position: "absolute",
    top: 0,
    left: 50,
    bottom: 0,
    right: 50,
    justifyContent: "center",
    alignItems: 'center',
    // transform: [{translateY: "-50%"}, {translateX: "-50%"}]
  }
})

export default TitleBar; 