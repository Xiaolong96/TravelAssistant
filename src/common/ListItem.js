import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

import * as constants from '../constants/index'

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    
  }

  componentDidMount() {
  }


  render() {
    return (
        <View style={styles.container}>
        <View style={styles.itemWrap}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon name={this.props.iconName} size={24} color={this.props.iconColor} />
              <Text style={{color: constants.GRAY_DARKEST, fontSize: 16, marginLeft: 16}}>
                  {this.props.title}
              </Text>
            </View>
            <Icon name="ios-arrow-forward" size={20} color={constants.GRAY} />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemWrap: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: .2,
    borderColor: constants.GRAY,
    borderStyle: "solid",
    paddingLeft: 8,
    paddingRight: 8,
    
  }
})

export default ListItem;
