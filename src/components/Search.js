import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import * as constants from '../constants/index'
import Icon from "react-native-vector-icons/Ionicons";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchHistoryData: [{
        id: '1',
        text: '北京',
      }, {
        id: '2',
        text: '庐山',
      }, {
        id: '3',
        text: '宜春',
      }, {
        id: '4',
        text: '杭州',
      }, {
        id: '5',
        text: '三清山',
      }],
      loading: false,
      searchHotData: [{
        id: '1',
        text: '北京',
      }, {
        id: '2',
        text: '青岛',
      }, {
        id: '3',
        text: '庐山',
      }, {
        id: '4',
        text: '拉萨',
      }, {
        id: '5',
        text: '大理',
      }],
    };
  }

  componentDidMount() {
    // alert(JSON.stringify(this.props.navigation.state));
  }

  searchSubmit(searchText) {
    if(this.state.searchText) {
      // alert(searchText);
      this.props.navigation.navigate('Home', {searchText: searchText})
    }
  }

  getSearchData() {

  }

  onSearchItemPress(text) {
    this.setState({searchText: text});
    setTimeout(() => {
      this.searchSubmit(text);
    }, 200);
  }

  clearSearchRecord() {
    alert('clear');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <TouchableWithoutFeedback
              onPress={() => this.searchSubmit(this.state.searchText)}
            >
              <Icon name="ios-search" size={24} color={constants.GRAY_DARKER} />
            </TouchableWithoutFeedback>
            <TextInput
              style={{marginLeft: 16}}
              onChangeText={(searchText) => this.setState({searchText})}
              value={this.state.searchText}
              autoFocus={true}
              onSubmitEditing={(e) => this.searchSubmit(e.nativeEvent.text)}
              placeholder='请输入城市或景点名'
              selectionColor={constants.MAIN_COLOR}
            />
          </View>
        </View>
        <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 16,marginTop: 8}}>
          <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 30}} />
          <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16}}>热门搜索</Text>
        </View>
        <View style={{height: 120}}>
        <FlatList
          style={{margin: 16}}
          horizontal={false}
          numColumns={3}
          data={this.state.searchHotData}
          extraData={this.state}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator = {false}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                this.getSearchData()
              }}
              refreshing={this.state.loading}
              colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
            />
          }
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={() => this.onSearchItemPress(item.text)}>
              <View style={[styles.searchItem, {backgroundColor: constants.MAIN_COLOR_LIGHT}]}>
                <Text numberOfLines={1} ellipsizeMode='clip' style={{fontSize: 14, color: constants.GRAY_DARKER}}>
                  {item.text}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            )}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={this.clearSearchRecord}>
          <View style={{alignItems: 'center',marginTop: 20}}>
            <Text style={{fontSize: 14, color: constants.MAIN_COLOR}}>
              清除搜索记录
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 16,marginTop: 16}}>
          <View style={{backgroundColor: constants.MAIN_COLOR, width: 3, height: 30}} />
          <Text style={{marginLeft: 8, color: constants.GRAY_DARKEST, fontSize: 16}}>搜索历史</Text>
        </View>
        <FlatList
          style={{margin: 16}}
          horizontal={false}
          numColumns={3}
          data={this.state.searchHistoryData}
          extraData={this.state}
          showsVerticalScrollIndicator = {false}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                this.getSearchData()
              }}
              refreshing={this.state.loading}
              colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
            />
          }
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={() => this.onSearchItemPress(item.text)}>
              <View style={styles.searchItem}>
                <Text numberOfLines={1} ellipsizeMode='clip' style={{fontSize: 14, color: constants.GRAY_DARKER}}>
                  {item.text}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            )}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.GRAY_LIGHTER,
    marginTop: 30
  },
  searchWrap: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 8,
    backgroundColor: "#fff"
  },
  search: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: constants.GRAY_LIGHT,
  },
  searchItem: {
    width: 80,
    height: 30,
    // borderColor: constants.MAIN_COLOR,
    borderRadius: 15,
    // borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginRight: 20,
    marginBottom: 12,
    backgroundColor: constants.GRAY_LIGHT
  }
})

export default Search;
