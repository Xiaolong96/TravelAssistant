import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

class MyCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <View style={styles.container}>
          <Text>MyCollection</Text>
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

export default MyCollection;