package com.xl.travelassistant.activitys;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.gyf.barlibrary.ImmersionBar;
import com.xl.travelassistant.R;
import com.xl.travelassistant.annotation.SingleClick;
import com.xl.travelassistant.bean.UserRes;
import com.xl.travelassistant.utils.CountDownTimerUtils;
import com.xl.travelassistant.utils.HttpPath;
import com.xl.travelassistant.utils.ToastUtil;
import com.xl.travelassistant.utils.UserUtils;
import com.xl.travelassistant.views.InputView;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.concurrent.TimeUnit;

import cn.smssdk.EventHandler;
import cn.smssdk.SMSSDK;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ResetPasswordActivity extends BaseActivity {
    private static final String TAG = "ResetPasswordActivity";
    private InputView mInputRegPhone, mInputRegPassword ,mInputCode;
    private TextView mTvCode;
    private EventHandler eventHandler;
    private int serversLoadTimes =0;
    private static final int maxLoadTimes =3;
    private OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)//设置连接超时时间
            .readTimeout(20, TimeUnit.SECONDS)//设置读取超时时间
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_password);
        ImmersionBar.with(this).statusBarDarkFont(true).init();
        mInputRegPhone = findViewById(R.id.input_reg_phone);
        mInputRegPassword = findViewById(R.id.input_reg_password);
        mInputCode = findViewById(R.id.input_code);
        mTvCode = findViewById(R.id.tv_code);
        sms_verification();
    }

    @SingleClick
    public void onSaveBtnClick (View view) {
        String phone = mInputRegPhone.getInputStr();
        String password = mInputRegPassword.getInputStr();
        String code = mInputCode.getInputStr();
        // 验证用户输入
        if(!UserUtils.validateInput(this, phone, password, code)) {
            return;
        }
        SMSSDK.submitVerificationCode("86", phone, code);
    }

    @SingleClick
    public void getCode (View view) {
        String phone = mInputRegPhone.getInputStr();
        if(UserUtils.validateInput(this, phone)) {
            SMSSDK.getVerificationCode("86",phone);//获取你的手机号的验证码
        }
    }

    public void sms_verification () {
        // 在尝试读取通信录时以弹窗提示用户（可选功能）
        SMSSDK.setAskPermisionOnReadContact(true);

        eventHandler = new EventHandler() {
            public void afterEvent(int event, int result, Object data) {
                Message msg=new Message();//创建了一个对象
                msg.arg1=event;
                msg.arg2=result;
                msg.obj=data;
                new Handler(Looper.getMainLooper(), new Handler.Callback() {
                    @Override
                    public boolean handleMessage(Message msg) {
                        int event = msg.arg1;
                        int result = msg.arg2;
                        Object data = msg.obj;
                        if (event == SMSSDK.EVENT_GET_VERIFICATION_CODE) {
                            if (result == SMSSDK.RESULT_COMPLETE) {
                                // TODO 处理成功得到验证码的结果
                                // 请注意，此时只是完成了发送验证码的请求，验证码短信还需要几秒钟之后才送达
                                //回调完成
                                String phone = mInputRegPhone.getInputStr();
                                boolean smart = (Boolean)data;
                                if(smart) {
                                    Toast.makeText(getApplicationContext(),"该手机号已经注册过，请重新输入",Toast.LENGTH_LONG).show();
                                    return false;
                                } else {
                                    CountDownTimerUtils mCountDownTimerUtils = new CountDownTimerUtils(mTvCode, 60000, 1000); //倒计时1分钟
                                    mCountDownTimerUtils.start();
                                    Toast.makeText(getApplicationContext(),"验证码已发送，请注意查收",Toast.LENGTH_LONG).show();
                                }
                            } else {
                                // TODO 处理错误的结果
                                Toast.makeText(getApplicationContext(),"验证码获取失败请重新获取", Toast.LENGTH_LONG).show();
                                ((Throwable) data).printStackTrace();
                            }
                        } else if (event == SMSSDK.EVENT_SUBMIT_VERIFICATION_CODE) {
                            if (result == SMSSDK.RESULT_COMPLETE) {
                                // TODO 处理验证码验证通过的结果
                                serversLoadTimes = 0;
                                RequestBody requestBody =
                                        new FormBody.Builder()
                                                .add("phone", mInputRegPhone.getInputStr())
                                                .add("passwordNew", mInputRegPassword.getInputStr())
                                                .build();
                                Log.e(TAG, HttpPath.getResetPasswordPath());
                                Request req = new Request.Builder().url(HttpPath.getResetPasswordPath()).post(requestBody).build();
                                Call call = client.newCall(req);
                                call.enqueue(new Callback() {
                                    @Override
                                    public void onFailure(Call call, IOException e) {
                                        //失败回调
                                        Log.e(TAG, "onFailure: " + e.getMessage());
                                        if (e instanceof SocketTimeoutException && serversLoadTimes < maxLoadTimes)//如果超时并未超过指定次数，则重新连接
                                        {
                                            serversLoadTimes++;
                                            Log.e(TAG, "Reconnect: " + serversLoadTimes + " times");
                                            client.newCall(call.request()).enqueue(this);
                                        } else {
                                            e.printStackTrace();
                                        }

                                    }

                                    @Override
                                    public void onResponse(Call call, Response response) throws IOException {
                                        String content = response.body().string();
                                        Log.e(TAG, "onResponse: " + content);
                                        //使用gson来获取数据并且进行操作
                                        Gson gson = new Gson();
                                        //序列化
                                        UserRes userRes = gson.fromJson(content, UserRes.class);
                                        Log.e(TAG, "userRes: ");
                                        int status = userRes.getStatus();
                                        String msg = userRes.getMsg();
                                        Log.e(TAG, "status: " + status);
                                        Log.e(TAG, "msg: " + msg);
                                        if (status == 0) {
                                            ToastUtil.showToast(ResetPasswordActivity.this, "密码重置成功，请登陆");
                                            Intent intent = new Intent(ResetPasswordActivity.this, LoginActivity.class);
                                            startActivity(intent);
                                            ResetPasswordActivity.this.finish();
                                        } else {
                                            ToastUtil.showToast(ResetPasswordActivity.this, msg);
                                        }
                                    }
                                });
                            } else {
                                // TODO 处理错误的结果
                                Toast.makeText(getApplicationContext(),"验证码输入错误", Toast.LENGTH_LONG).show();
                                ((Throwable) data).printStackTrace();
                                return false;
                            }
                        }
                        // TODO 其他接口的返回结果也类似，根据event判断当前数据属于哪个接口
                        return false;
                    }
                }).sendMessage(msg);
            }
        };

        SMSSDK.registerEventHandler(eventHandler);//注册短信回调（记得销毁，避免泄露内存）*/
    }


    // 使用完EventHandler需注销，否则可能出现内存泄漏
    protected void onDestroy() {
        super.onDestroy();
        SMSSDK.unregisterEventHandler(eventHandler);
    }
}
