import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, Dimensions, ToastAndroid, RefreshControl,
  FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import * as constants from '../constants/index';
import httpUrl from '../constants/httpUrl';
import * as request from "../fetch/index"
import formatDate from '../utils/FormatDate';
import Icon from "react-native-vector-icons/Ionicons";
import AlertSelected from '../common/AlertSelected'






class BrowseHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      record: [],
    };
  }

  componentWillMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content', false);
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(false, false);
      StatusBar.setBackgroundColor(constants.GRAY_LIGHTER);
    });
    this.getRecord();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  getRecord() {
    const url = httpUrl.GETBROWSERECORD;
    this.setState({loading: true});
    request.postData(url)
    .then((res) => {
      this.setState({loading: false});
      if(res.status == 0) {
          let record = res.data.reverse();
          const url = httpUrl.GETTRAVELNOET;
          let r = record;
          record.forEach((item, index) => {
            const data = {
                noteId: item.noteId,
            }
            let i = index;
            request.postData(url, data)
            .then((res) => {
            if(res.status == 0) {
              if(JSON.stringify(res.data) == '{}') {
                r[i].noteTitle = '游记不存在';
              } else {
                r[i].noteTitle = res.data.noteTitle;
              }
              this.setState({record: r});
            } else {
                // ToastAndroid.show(res.msg, 1000);
            }
            })
          })
          
        // setTimeout(() => {
        //   this.setState({record: r});
        //   alert(JSON.stringify(r));
        // }, 500)
        // alert(JSON.stringify(r));
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  onRecordPress(noteId) {
    const url = httpUrl.GETTRAVELNOET;
    const data = {
      noteId: noteId,
    }
    request.postData(url, data)
    .then((res) => {
      if(res.status == 0) {
        if(JSON.stringify(res.data) == '{}') {
          ToastAndroid.show('游记不存在', 1000)
        } else {
          this.props.navigation.navigate('TravelNoteDetail', {travelNote: res.data})
        }
        // alert(JSON.stringify(myNews));
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  deleteRecord() {
    const url = httpUrl.DELETEBROWSERECORD;
    request.postData(url)
    .then((res) => {
      if(res.status == 0) {
        this.setState({record: []})
        ToastAndroid.show(res.msg, 1000);
      } else {
        ToastAndroid.show(res.msg, 1000);
      }
    })
  }

  showAlertSelected(){
    this.dialog.show("操作", ['清除浏览记录'], constants.MAIN_COLOR, this.callbackSelected.bind(this));
  }
  callbackSelected(i){
    switch (i){
      case 0:
        this.deleteRecord();
        break;
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
            <TouchableWithoutFeedback
              onPress = {() => {this.props.navigation.goBack()}}>
              <View style={{width: 40, height: 40, justifyContent: 'center',}}>
                <Icon name="ios-arrow-back" size={20} color={constants.GRAY_DARKEST} />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.title}>
                <Text style={{fontSize: 16, color: constants.GRAY_DARKEST, fontWeight: "700"}}>浏览记录</Text>
            </View>
            <TouchableWithoutFeedback
              onPress = {this.showAlertSelected.bind(this)}>
              <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Icon name="ios-more" size={20} color={constants.GRAY_DARKEST} />
              </View>
            </TouchableWithoutFeedback>
        </View>
        <FlatList
          data={this.state.record}
          extraData={this.state}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator = {false}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                this.getRecord();
              }}
              refreshing={this.state.loading}
              colors={[constants.MAIN_COLOR, "lightgreen", "skyblue"]}
            />
          }
          renderItem={({item, index}) => {
            let i = item;
              return (
                <TouchableWithoutFeedback
                  onPress={this.onRecordPress.bind(this, item.noteId)}>
                  <View 
                    style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16}}>
                    <Icon name="ios-paper" size={30} color={constants.BLUE_LIGHT} />
                    <View style={{marginLeft: 12, paddingVertical: 12, borderBottomWidth: .2, borderBottomColor: constants.GRAY, borderStyle: 'solid'}}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color: constants.GRAY_DARKEST, fontSize: 14, width: Dimensions.get('window').width-74}}>{ i.noteTitle }</Text>
                        <Text style={{color: constants.GRAY_DARK, fontSize: 12}}>{formatDate("yyyy-MM-dd hh:mm:ss", i.createTime)}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            }
          }
        />
        <AlertSelected ref={(dialog)=>{
            this.dialog = dialog;
          }} />
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
  titleBar: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: constants.GRAY_LIGHTER,
  },
  title: {
    position: "absolute",
    top: 0,
    left: 50,
    bottom: 0,
    right: 50,
    justifyContent: "center",
    alignItems: 'center',
    // transform: [{translateY: "-50%"}, {translateX: "-50%"}]
  }
})

export default BrowseHistory;
