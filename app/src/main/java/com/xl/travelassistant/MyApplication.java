package com.xl.travelassistant;

import android.app.Application;

import com.blankj.utilcode.util.Utils;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.mob.MobSDK;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.xl.travelassistant.utils.OpenNativePackage;

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
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new OpenNativePackage(),
                    new RNGestureHandlerPackage(),
                    new VectorIconsPackage()
                    );
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
        // 初始化MobSDK
        MobSDK.init(this);
    }
}
