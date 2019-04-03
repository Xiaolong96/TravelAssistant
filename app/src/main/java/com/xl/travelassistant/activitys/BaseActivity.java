package com.xl.travelassistant.activitys;

import android.support.annotation.IdRes;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.gyf.barlibrary.ImmersionBar;
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

    public void onBack (View view) {
//        onBackPressed();
        finish();
//        ((Activity)this).overridePendingTransition(R.anim.close_enter, R.anim.close_exit);
    }

//    @Override
//    public void finish () {
//        super.finish();
//        // 注销掉activity本身的动画，防止对style中设置的动画产生干扰
//        overridePendingTransition(0, 0);
//    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 必须调用该方法，防止内存泄漏
        ImmersionBar.with(this).destroy();
    }
}
