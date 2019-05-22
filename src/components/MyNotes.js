import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, ToastAndroid, RefreshControl,
  FlatList } from 'react-native';
import * as constants from '../constants/index';
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index"
// import DeviceStorage from '../utils/DeviceStorage';

import TitleBar from '../common/TitleBar';
import TravelNote from './TravelNote'




class MyNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      travelNotes: [],
    };
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor(constants.GRAY_LIGHTER);
    });
    this.getTravelNote();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  getTravelNote() {
    const url = httpUrl.GETUSERTRAVELNOTE;
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
        <TitleBar title="我的游记" callback={() => this.props.navigation.goBack()}/>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: constants.GRAY_LIGHTER,
  },
 
})

export default MyNotes;
