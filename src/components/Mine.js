import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';

import * as constants from '../constants/index'

class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.MAIN_COLOR);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>Mine</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
})

export default Mine;