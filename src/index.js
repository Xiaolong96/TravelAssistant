import React, { Component } from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {
  Easing,
  Animated
} from 'react-native'

import Icon from "react-native-vector-icons/Ionicons"

import * as constants from './constants/index' 

import Home from "./components/Home"
import Strategy from "./components/Strategy"
import Mine from "./components/Mine"
import Search from "./components/Search"
import ScenicSpotDetail from "./components/ScenicSpotDetail"
import Map from './components/Map'
import MyCollection from './components/MyCollection'
import Setting from './components/Setting'
import EditUserInfo from './components/EditUserInfo'
import EditText from './components/EditText'
import UpdatePassword from './components/UpdatePassword'

const BottomTab = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: '首页',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" size={20} color={tintColor} />
      ),
    },
  },
  Strategy: {
    screen: Strategy,
    navigationOptions: {
      tabBarLabel: '攻略',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-compass" size={20} color={tintColor} />
      ),
    },
  },
  Mine: {
    screen: Mine,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-person" size={20} color={tintColor} />
      ),
    },
  }
}, {
    initialRouteName: 'Home', // 设置默认的页面
    //是否允许滑动切换tab页
    swipeEnabled: true,
    //是否在切换tab页时使用动画
    animationEnabled: true,
    //是否懒加载
    lazy: true,
    backBehavior: 'initialRoute', // 点击返回退到上级界面
    tabBarOptions: {
      activeTintColor: constants.MAIN_COLOR,
      inactiveTintColor: constants.GRAY,
      labelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
      style: {
        borderTopWidth: 0.2,
        borderTopColor: constants.GRAY_LIGHT,
        height: 50,
        backgroundColor: '#fff'
      },
    }

  });

const MyApp = createStackNavigator({
  Main: {
    screen: BottomTab,
    navigationOptions: {
      header: null
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      header: null
    }
  },
  ScenicSpotDetail: {
    screen: ScenicSpotDetail,
    navigationOptions: {
      header: null
    }
  },
  Map: {
    screen: Map,
    navigationOptions: {
      header: null
    }
  },
  MyCollection: {
    screen: MyCollection,
    navigationOptions: {
      header: null
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      header: null
    }
  },
  EditUserInfo: {
    screen: EditUserInfo,
    navigationOptions: {
      header: null
    }
  },
  EditText: {
    screen: EditText,
    navigationOptions: {
      header: null
    }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {
      header: null
    }
  }
}, {
    headerMode: 'screen',
    // headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateX }] };
      },
    }),
  });
export default createAppContainer(MyApp)
