package com.xl.travelassistant.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface SingleClick {
    /* 点击间隔时间 */
    long value() default 1000;
}

// 使用
// 如果需要自定义点击时间间隔，自行传入毫秒值即可
// @SingleClick(2000)
//@SingleClick
