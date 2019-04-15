import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // alert(JSON.stringify(this.props.navigation.state));
  }
  render() {
    return (
        <View style={styles.container}>
          <Text>Search</Text>
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

export default Search;