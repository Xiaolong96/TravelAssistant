import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableWithoutFeedback, ToastAndroid, RefreshControl,
  FlatList, Alert } from 'react-native';
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
      showTip: true,
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

  handleLongPress(id, index) {
    Alert.alert(
      '提示',
      '确认删除游记？',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '确定', onPress: () => this.deleteTravelNote(id, index)},
      ],
      { cancelable: false }
    )
  }

  deleteTravelNote(id, index) {
    const url = httpUrl.DELETETRAVELNOTE;
    const data = {
      noteId: id,
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        let travelNotes = this.state.travelNotes;
        travelNotes.splice(index, 1);
        this.setState({travelNotes});
        ToastAndroid.show(res.msg, 1000);
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <TitleBar title="我的游记" callback={() => this.props.navigation.goBack()}/>
        <TouchableWithoutFeedback
          onPress={() => {this.setState({showTip: false})}}>
          <Text style={{width: "100%", height: 36, backgroundColor: "#FEEFB8", color: "#C78E56", fontSize: 14, paddingHorizontal: 3, borderRadius: 3, flex: 0, lineHeight: 36, textAlign: 'center', display: this.state.showTip?'flex':'none'}}>
          长按可进行删除游记</Text>
          </TouchableWithoutFeedback>
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
          renderItem={({item, index}) => {
            let i = item;
              return (
                <TouchableWithoutFeedback
                  onLongPress={this.handleLongPress.bind(this, item.id, index)}
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
