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
      //是否允许滑动切换tab页
      swipeEnabled: true,
      //是否在切换tab页时使用动画
      animationEnabled: false,
      //是否懒加载
      lazy: true,
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
