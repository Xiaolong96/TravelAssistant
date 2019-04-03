import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';

import * as constants from '../constants/index'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>Home</Text>
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

export default Home;
