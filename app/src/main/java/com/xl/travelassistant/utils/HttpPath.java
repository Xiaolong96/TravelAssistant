package com.xl.travelassistant.utils;

public class HttpPath {
    private static final String IP="http://172.20.10.2:8080/travel-assistant/";

    public static String getUserLoginPath(){

        return IP+"user/login.do";
    }
}
