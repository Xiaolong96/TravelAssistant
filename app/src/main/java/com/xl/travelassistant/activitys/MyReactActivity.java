package com.xl.travelassistant.activitys;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import javax.annotation.Nullable;

public class MyReactActivity extends ReactActivity {
//    private long exitTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    protected String getMainComponentName() {
        return "MyReactNativeApp";   //MyReactNativeApp即注册ReactNative时的名称;
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
         return new RNGestureHandlerEnabledRootView(MyReactActivity.this);
        }
      };
    }

//    class MyreactDelegate extends ReactActivityDelegate {
//
//        public MyreactDelegate(Activity activity, @Nullable String mainComponentName) {
//            super(activity, mainComponentName);
//        }
//        @Nullable
//        @Override
//        protected Bundle getLaunchOptions() {
//            Bundle bundle = new Bundle();
//            bundle.putString("fromtag", "C");
//            bundle.putString("data3", "android传递的初始化参数");
//            return bundle;
//        }
//    }

//    public void onBackPressed() {
//        doubleBackQuit();
//    }
//    /**
//     * 连续按两次返回键，退出应用
//     */
//    private void doubleBackQuit()
//    {
//        if (System.currentTimeMillis() - exitTime > 2000) {
//            Toast.makeText(getApplicationContext(), "再按一次返回退出程序", Toast.LENGTH_SHORT).show();
//            exitTime = System.currentTimeMillis();
//        } else {
//            finish();
//        }
//    }
}
