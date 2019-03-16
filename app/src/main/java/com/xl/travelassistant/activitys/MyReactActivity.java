package com.xl.travelassistant.activitys;

import com.facebook.react.ReactActivity;

import javax.annotation.Nullable;

public class MyReactActivity extends ReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "MyReactNativeApp";   //MyReactNativeApp即注册ReactNative时的名称;
    }
}
