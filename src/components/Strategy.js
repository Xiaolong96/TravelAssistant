import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MapView } from 'react-native-amap3d'

class Strategy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <View style={styles.container}>
          <MapView
            style={{height: "100%", width: "100%"}}
            coordinate={{
              latitude: 39.91095,
              longitude: 116.37296,
            }}
          />
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

export default Strategy;