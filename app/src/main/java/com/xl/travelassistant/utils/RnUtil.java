package com.xl.travelassistant.utils;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RnUtil{

    //定义发送事件的函数
    private static void sendEventToRn(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static void sendMsg(ReactContext reactContext, String eventName, WritableMap params)
    {
        //在该方法中开启线程，并且延迟0.1秒，然后向JavaScript端发送事件。
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                sendEventToRn(reactContext,eventName, params);
            }
        }).start();
    }

}
