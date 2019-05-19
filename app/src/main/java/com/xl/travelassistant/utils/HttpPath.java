package com.xl.travelassistant.utils;

public class HttpPath {
    private static final String IP="http://172.26.75.93:8080/travel-assistant/";

    public static String getUserLoginPath(){

        return IP+"user/login.do";
    }
    public static String getUserRegisterPath(){

        return IP+"user/register.do";
    }
    public static String getResetPasswordPath(){

        return IP+"user/forget_reset_password.do";
    }
}
