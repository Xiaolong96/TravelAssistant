package com.xl.travelassistant.bean;

public class UserRes {
    private int status;

    private String msg;

    private Data data;

    public UserRes() {

    }

    public UserRes(int status, String msg, Data data) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    public static class Data {
        private int id;

        private String phone;

        private String username;

        private String password;

        private Long createTime;

        private Long updateTime;

        private String token;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }
}
