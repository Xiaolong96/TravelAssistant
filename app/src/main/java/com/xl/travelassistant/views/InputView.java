package com.xl.travelassistant.views;

import android.content.Context;
import android.content.res.TypedArray;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.text.Html;
import android.text.InputType;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.xl.travelassistant.R;

public class InputView extends FrameLayout {
    private String inputIcon;
    private String inputHint;
    private Boolean isPassword;

    private View mView;
    private TextView mTvIcon;
    private EditText mEtInput;

    public InputView(Context context) {
        super(context);
        init(context, null);
    }

    public InputView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs);
    }

    public InputView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public InputView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init(context, attrs);
    }

    private void init (Context context, AttributeSet attrs) {
        if(attrs == null) {
            return;
        }

//        获取自定义属性
        TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.inputView);
        inputIcon = typedArray.getString(R.styleable.inputView_input_icon);
        inputHint = typedArray.getString(R.styleable.inputView_input_hint);
        isPassword = typedArray.getBoolean(R.styleable.inputView_is_password, false);
        typedArray.recycle();

//        绑定layout布局
        LayoutInflater inflater = LayoutInflater.from(context);
//        还可以用以下两种方式获取LayoutInflater 实例
//        LayoutInflater inflater = getLayoutInflater();  //调用Activity的getLayoutInflater()
//        LayoutInflater localinflater =  (LayoutInflater)context.getSystemService（Context.LAYOUT_INFLATER_SERVICE);
        mView = inflater.inflate(R.layout.input_view, this, false);
        mTvIcon = mView.findViewById(R.id.tv_phone_icon);
        mEtInput = mView.findViewById(R.id.et_phone_number);

//        布局关联属性
        mTvIcon.setText(Html.fromHtml(inputIcon));
        mEtInput.setHint(inputHint);
        mEtInput.setInputType(isPassword ? InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD : InputType.TYPE_CLASS_PHONE);

        addView(mView);
    }

    /**
     * 返回输入内容
     * @return
     */
    public String getInputStr () {
        return mEtInput.getText().toString().trim();
    }
}
