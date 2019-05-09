package com.xl.travelassistant.utils;

import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.xl.travelassistant.activitys.LoginActivity;

public class OpenNativeModule extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;
    private static ReactContext myContext;

    public OpenNativeModule(ReactApplicationContext context) {
        super(context);
        this.mReactContext = context;
        this.myContext = context;
    }

    @Override
    public String getName() {
        return "OpenNativeModule";
    }

    public static void sendEventToRn(String eventName, @Nullable WritableMap paramss)
    {
        Log.e("LoginActivity","reactContext=" + myContext);

        myContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, paramss);

    }

    @ReactMethod
    public void openNativeVC() {
        Intent intent = new Intent();
        intent.setClass(mReactContext, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivity(intent);
    }
}
