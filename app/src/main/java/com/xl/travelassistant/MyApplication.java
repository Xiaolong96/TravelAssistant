package com.xl.travelassistant;

import android.app.Application;

import com.blankj.utilcode.util.Utils;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MyApplication extends Application implements ReactApplication {

    private final ReactNativeHost reactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }
        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(new MainReactPackage());
        }
        // 这是需要添加的
        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };
    @Override
    public ReactNativeHost getReactNativeHost() {
        return reactNativeHost;
    }
    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this,false);
        // 初始化引入的安卓类库
        Utils.init(this);
    }
}
