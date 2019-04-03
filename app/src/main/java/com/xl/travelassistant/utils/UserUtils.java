package com.xl.travelassistant.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.widget.Toast;

import com.blankj.utilcode.util.RegexUtils;
import com.xl.travelassistant.R;
import com.xl.travelassistant.activitys.LoginActivity;

public class UserUtils {
    public static Boolean validateInput (Context context, String phone) {
        String code = "1234";
        String password = "abcdefg";
        return validateInput(context, phone ,password, code);
    }
    public static Boolean validateInput (Context context, String phone, String password) {
        String code = "1";
        return validateInput(context, phone ,password, code);
    }
    public static Boolean validateInput (Context context, String phone, String password, String code) {
        if(!RegexUtils.isMobileExact(phone)) {
            Toast.makeText(context, "请输入正确的手机号", Toast.LENGTH_SHORT).show();
            return false;
        }
        if(TextUtils.isEmpty(code)) {
            Toast.makeText(context, "请输入验证码", Toast.LENGTH_SHORT).show();
            return false;
        }
        if(TextUtils.isEmpty(password)) {
            Toast.makeText(context, "请输入密码", Toast.LENGTH_SHORT).show();
            return false;
        }
//        Toast.makeText(context, "验证成功", Toast.LENGTH_SHORT).show();
        return true;
    }

    public void logout (Context context) {
        Intent intent = new Intent(context, LoginActivity.class);
//        添加intent标识符，清理task栈，并且新生成一个task栈
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
//        定义Activity跳转动画，解决动画错乱
        ((Activity)context).overridePendingTransition(R.anim.open_enter, R.anim.open_exit);
    }
}
