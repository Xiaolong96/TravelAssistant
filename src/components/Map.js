import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MapView, Marker } from 'react-native-amap3d'
import * as constants from '../constants/index'

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.coord = this.props.navigation.state.params.coord;
  }

  componentDidMount() {
    this._mapView.animateTo({
      tilt: 45,
      // rotation: 90,
      zoomLevel: 17,
      coordinate: {
        latitude: this.coord.lat,
        longitude: this.coord.lon,
      }
    })
  }
  setMapView = (ref) => {
    this._mapView = ref
  }
  render() {
    return (
        <View style={styles.container}>
          <MapView
            ref={this.setMapView}
            style={{height: "100%", width: "100%"}}
            showsZoomControls={false}
          >
          <Marker
            active
            color='red' 
            coordinate={{
              latitude: this.coord.lat,
              longitude: this.coord.lon,
            }}
        >
        <View style={styles.infoWindow}>
            <Text style={{color: '#fff', fontSize: 12,}}>{this.coord.name}</Text>
        </View>
        </Marker>
          </MapView>
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
  infoWindow: {
    backgroundColor: constants.MAIN_COLOR,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    elevation: 4,
    // borderWidth: 1,
    // borderColor: constants.MAIN_COLOR,
  },
})

export default Map;