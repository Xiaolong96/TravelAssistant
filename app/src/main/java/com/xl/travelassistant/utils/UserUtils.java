package com.xl.travelassistant.utils;

import android.content.Context;
import android.text.TextUtils;
import android.widget.Toast;

import com.blankj.utilcode.util.RegexUtils;

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
}
