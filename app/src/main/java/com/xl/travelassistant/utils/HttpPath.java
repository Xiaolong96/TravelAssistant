package com.xl.travelassistant.utils;

public class HttpPath {
    private static final String IP="http://106.15.224.114:8080/xl/";

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
