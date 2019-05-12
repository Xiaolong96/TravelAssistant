package com.xl.travelassistant.activitys;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.gyf.barlibrary.ImmersionBar;
import com.tencent.connect.UserInfo;
import com.tencent.connect.auth.QQToken;
import com.tencent.connect.common.Constants;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;
import com.xl.travelassistant.R;
import com.xl.travelassistant.annotation.SingleClick;
import com.xl.travelassistant.bean.TestBean;
import com.xl.travelassistant.bean.UserRes;
import com.xl.travelassistant.utils.HttpPath;
import com.xl.travelassistant.utils.OpenNativeModule;
import com.xl.travelassistant.utils.ToastUtil;
import com.xl.travelassistant.utils.UserUtils;
import com.xl.travelassistant.views.InputView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.concurrent.TimeUnit;

import okhttp3.CacheControl;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;


public class LoginActivity extends BaseActivity  {
    private static final String TAG = "LoginActivity";
    private static final String APP_ID = "101560872";//官方获取的APPID
    private Tencent mTencent;
    private BaseUiListener mIUiListener;
    private UserInfo mUserInfo;

    private InputView mInputPhone, mInputPassword;

    private int serversLoadTimes =0;
    private static final int maxLoadTimes =3;
    private OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)//设置连接超时时间
            .readTimeout(20, TimeUnit.SECONDS)//设置读取超时时间
            .build();

    public ReactContext myContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ImmersionBar.with(this).statusBarDarkFont(true).init();
        //传入参数APPID和全局Context上下文
        mTencent = Tencent.createInstance(APP_ID, LoginActivity.this.getApplicationContext());
        mInputPhone = findViewById(R.id.input_phone);
        mInputPassword = findViewById(R.id.input_password);
    }


    /**
     * 登录
     */
    @SingleClick
    public void onLoginBtnClick (View v) {
        String phone = mInputPhone.getInputStr();
        String password = mInputPassword.getInputStr();
        // 验证用户输入
        if(!UserUtils.validateInput(this, phone, password)) {
//            Toast.makeText(this, "验证", Toast.LENGTH_SHORT).show();
            return;
        }
        serversLoadTimes = 0;
        RequestBody requestBody =
                new FormBody.Builder()
                        .add("phone", phone)
                        .add("password", password)
                        .build();
        Log.e(TAG, HttpPath.getUserLoginPath());
        Request req = new Request.Builder().url(HttpPath.getUserLoginPath()).post(requestBody).build();
        Call call = client.newCall(req);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                //失败回调
                Log.e(TAG, "onFailure: " + e.getMessage());
                if(e instanceof SocketTimeoutException && serversLoadTimes < maxLoadTimes)//如果超时并未超过指定次数，则重新连接
                {
                    serversLoadTimes++;
                    Log.e(TAG, "Reconnect: " + serversLoadTimes + " times");
                    client.newCall(call.request()).enqueue(this);
                }else {
                    e.printStackTrace();
                }

            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                //成功回调，当前线程为子线程，如果需要更新UI，需要post到主线程中

                boolean successful = response.isSuccessful();
                //响应消息头
                Headers headers = response.headers();
                //响应消息体
                ResponseBody body = response.body();
                String content = response.body().string();
                //缓存控制
                CacheControl cacheControl = response.cacheControl();

                Log.e(TAG, response.protocol() + " " +response.code() + " " + response.message());
                for (int i = 0; i < headers.size(); i++) {
                    Log.e(TAG, headers.name(i) + ":" + headers.value(i));
                }

                Log.e(TAG, "onResponse: " + content);
                //使用gson来获取数据并且进行操作
                Gson gson=new Gson();
                TestBean test = new TestBean(2);
                String json = gson.toJson(test);
                Log.e(TAG, "json : " + json);
                Log.e(TAG, "info: " + "gson");
                TestBean test2 = gson.fromJson(json, TestBean.class);
                Log.e(TAG, "test2: " + test2.getStatus());
                //序列化
                UserRes userRes = gson.fromJson(content, UserRes.class);
                Log.e(TAG, "userRes: ");
                int status = userRes.getStatus();
                String msg = userRes.getMsg();
                Log.e(TAG, "status: " + status);
                Log.e(TAG, "msg: " + msg);
                if(status == 0) {
                    Log.e(TAG, "info: " + "等于零");
                    WritableMap event = Arguments.createMap();
                    //传递的参数
                    event.putString("userRes",content);
                    event.putString("password",mInputPassword.getInputStr());
                    OpenNativeModule.sendEventToRn("LoginSuccess", event);
                    Intent intent = new Intent(LoginActivity.this, MyReactActivity.class);
                    startActivity(intent);
                    LoginActivity.this.finish();
                } else {
                    Log.e(TAG, "info: " + "no等于零");
                    ToastUtil.showToast(LoginActivity.this, msg);
                }
            }
        });
//        Intent intent = new Intent(this, MainActivity.class);
//        startActivity(intent);
    }

    /**
     * 跳转到注册页面
     * @param v
     */
    public void goRegister (View v) {
        Intent intent = new Intent(this, RegisterActivity.class);
        startActivity(intent);
    }

    /**
     * 跳转到重置密码页面
     * @param view
     */
    public void onFogetPassword (View view) {
        Intent intent = new Intent(this, ResetPasswordActivity.class);
        startActivity(intent);
    }

    /**
     * QQ登录
     * @param v
     */
    public void QQLogin(View v){
        /**通过这句代码，SDK实现了QQ的登录，这个方法有三个参数，第一个参数是context上下文，第二个参数SCOPO 是一个String类型的字符串，表示一些权限
         官方文档中的说明：应用需要获得哪些API的权限，由“，”分隔。例如：SCOPE = “get_user_info,add_t”；所有权限用“all”
         第三个参数，是一个事件监听器，IUiListener接口的实例，这里用的是该接口的实现类 */
        if (!mTencent.isSessionValid()) {
            mIUiListener = new BaseUiListener();
            //all表示获取所有权限
            mTencent.login(LoginActivity.this,"all", mIUiListener);
        }
    }

    public void QQlogout()
    {
        mTencent.logout(this);
    }

    /**
     * 自定义监听器实现IUiListener接口后，需要实现的3个方法
     * onComplete完成 onError错误 onCancel取消
     */
    private class BaseUiListener implements IUiListener {

        @Override
        public void onComplete(Object response) {
            Toast.makeText(LoginActivity.this, "授权成功", Toast.LENGTH_SHORT).show();
            Log.e(TAG, "response:" + response);
            JSONObject obj = (JSONObject) response;
            try {
                String openID = obj.getString("openid");
                String accessToken = obj.getString("access_token");
                String expires = obj.getString("expires_in");
                mTencent.setOpenId(openID);
                mTencent.setAccessToken(accessToken,expires);
                QQToken qqToken = mTencent.getQQToken();
                mUserInfo = new UserInfo(getApplicationContext(),qqToken);
                mUserInfo.getUserInfo(new IUiListener() {
                    @Override
                    public void onComplete(Object response) {
                        Log.e(TAG,"登录成功"+response.toString());
                    }

                    @Override
                    public void onError(UiError uiError) {
                        Log.e(TAG,"登录失败"+uiError.toString());
                    }

                    @Override
                    public void onCancel() {
                        Log.e(TAG,"登录取消");

                    }
                });
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onError(UiError uiError) {
            Toast.makeText(LoginActivity.this, "授权失败", Toast.LENGTH_SHORT).show();

        }

        @Override
        public void onCancel() {
            Toast.makeText(LoginActivity.this, "授权取消", Toast.LENGTH_SHORT).show();

        }
    }

    /**
     * 在调用Login的Activity或者Fragment中重写onActivityResult方法
     * @param requestCode
     * @param resultCode
     * @param data
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(requestCode == Constants.REQUEST_LOGIN){
            Tencent.onActivityResultData(requestCode,resultCode,data,mIUiListener);
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

}

