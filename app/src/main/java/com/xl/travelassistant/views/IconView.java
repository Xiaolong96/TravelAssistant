package com.xl.travelassistant.views;

import android.content.Context;
import android.graphics.Typeface;
import android.support.v7.widget.AppCompatTextView;
import android.util.AttributeSet;

public class IconView extends AppCompatTextView {
    /*
     * 控件在xml加载的时候是调用两个参数的构造函数 ，为了自定义的控件的完整性我们可以
     * 都把构造函数写出来
     */
    public IconView(Context context) {
        super(context);
        init(context);
    }
    public IconView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }
    public IconView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }
    /**
     * 初始化
     * @param context
     */
    private void init(Context context) {
        //设置字体图标
        Typeface font = Typeface.createFromAsset(context.getAssets(), "iconfont/iconfont.ttf");
        this.setTypeface(font);
    }

    /**
     * java动态修改图标
     */
//    IconView tvIcon = findViewById(R.id.tvIcon);
//    // tvIcon.setText("&#xe899;"); 无效
//    tvIcon.setText(Html.fromHtml("&#xe6b3;"));
//    若在strings文件中添加了，可以直接赋值
//    fontView.setText(getResources().getString(R.string.icon_back));
}
