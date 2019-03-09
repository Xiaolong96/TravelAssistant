package com.xl.travelassistant;

import javax.annotation.Nullable;

import com.facebook.react.ReactActivity;

public class MyReactActivity extends ReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "MyReactNativeApp";   //MyReactNativeApp即注册ReactNative时的名称;
    }
}
