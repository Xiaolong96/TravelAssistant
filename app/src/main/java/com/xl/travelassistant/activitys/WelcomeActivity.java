package com.xl.travelassistant.activitys;

import android.content.Intent;
import android.os.Bundle;

import com.xl.travelassistant.R;

import java.util.Timer;
import java.util.TimerTask;

public class WelcomeActivity extends BaseActivity {
    private Timer mTimer;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        init();
    }

    /**
     * 初始化
     */
    private void init() {
        mTimer = new Timer();
        mTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                toMain();
            }
        }, 3 * 1000);
    }

    /**
     * 跳转到MainActivity
     */
    private void toMain() {
        Intent intent = new Intent(this, MyReactActivity.class);
        startActivity(intent);
        finish();
    }
}
