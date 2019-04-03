package com.xl.travelassistant.activitys;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.gyf.barlibrary.ImmersionBar;
import com.xl.travelassistant.R;
import com.xl.travelassistant.annotation.SingleClick;
import com.xl.travelassistant.utils.CountDownTimerUtils;
import com.xl.travelassistant.utils.UserUtils;
import com.xl.travelassistant.views.InputView;

import cn.smssdk.EventHandler;
import cn.smssdk.SMSSDK;

public class RegisterActivity extends BaseActivity {
    private InputView mInputRegPhone, mInputRegPassword ,mInputCode;
    private TextView mTvCode;
    private EventHandler eventHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        ImmersionBar.with(this).statusBarDarkFont(true).init();
        mInputRegPhone = findViewById(R.id.input_reg_phone);
        mInputRegPassword = findViewById(R.id.input_reg_password);
        mInputCode = findViewById(R.id.input_code);
        mTvCode = findViewById(R.id.tv_code);
        sms_verification();
    }

    @SingleClick
    public void onRegisterBtnClick (View view) {
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
                                Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                                startActivity(intent);
                                finish();
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
