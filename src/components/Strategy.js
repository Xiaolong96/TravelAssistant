import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, FlatList, ToastAndroid, RefreshControl } from 'react-native';
import * as constants from '../constants/index';
import Icon from "react-native-vector-icons/Ionicons";
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index";
import CountEmitter from '../utils/CountEmitter'

import TravelNote from './TravelNote'


class Strategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      travelNotes: [],
      loading: false,
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(constants.WHITE);
    });
    CountEmitter.addListener('updateTravelNote', () => {
      this.getTravelNote();
    })
    this.getTravelNote();
  }

  componentWillUnmount() {
    this._navListener.remove();
    CountEmitter.removeListener('updateTravelNote');
  }

  getTravelNote() {
    const url = httpUrl.ALLTRAVELNOTE;
    this.setState({loading: true});
    request.postData(url)
    .then((res) => {
      this.setState({loading: false});
      if(res.status == 0) {
        this.setState({travelNotes: res.data.reverse()});
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={{height: 50, justifyContent: 'center', alignItems: 'center', borderBottomWidth: .2, borderColor: constants.GRAY, borderStyle: "solid",}}>
        <Text style={{fontSize: 18, fontWeight: '700', color: constants.GRAY_DARKEST}}>游记/攻略</Text>
      </View>

      <FlatList
        data={this.state.travelNotes}
        extraData={this.state}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator = {false}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              this.getTravelNote();
            }}
            refreshing={this.state.loading}
            colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
          />
        }
        renderItem={({item}) => {
          let i = item;
            return (
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('TravelNoteDetail', {travelNote: i})}>
                <View>
                  <TravelNote travelNote={i}/>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        }
      />

      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.navigate('PublishNote')}>
        <View style={styles.add}>
        <Icon name="ios-add" size={30} color={constants.WHITE} />
      </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  add: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: constants.MAIN_COLOR,
  }
})

export default Strategy;