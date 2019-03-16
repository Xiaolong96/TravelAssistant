package com.xl.travelassistant.activitys;

import android.support.annotation.IdRes;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.xl.travelassistant.R;

public class BaseActivity extends AppCompatActivity {
    private TextView mTvBack, mTvTitle, mTvUser;

    /**
     * 封装findViewById
     * @param id
     * @param <T>
     * @return
     */
    protected <T extends View> T fd (@IdRes int id) {
        return findViewById(id);
    }

    protected void initNavBar (Boolean showBack, String title, Boolean showUser) {
        mTvBack = fd(R.id.tv_back);
        mTvTitle = fd(R.id.tv_title);
        mTvUser = fd(R.id.tv_user);
        mTvBack.setVisibility(showBack ? View.VISIBLE : View.GONE);
        mTvUser.setVisibility(showUser ? View.VISIBLE : View.GONE);
        mTvTitle.setText(title);
        mTvBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }
}
