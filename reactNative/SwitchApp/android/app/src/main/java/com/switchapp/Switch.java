package com.switchapp;
import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.view.View;
import android.widget.Button;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
public class Switch extends Button {

    public Boolean isTurnedOn = false;

    public void setIsTurnedOn (Boolean switchStatus){
        isTurnedOn = switchStatus;
        changeColor();
    }
    public Switch(Context context) {
        super(context);
        this.setTextColor(Color.BLUE);
        this.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                isTurnedOn = !isTurnedOn;
                changeColor();
            }
        });
        changeColor();
    }

    private void changeColor() {
        if (isTurnedOn) {
            setBackgroundColor(Color.YELLOW);
            setText("I am ON");
        } else {
            setBackgroundColor(Color.GRAY);
            setText("I am OFF");
        }
    }

    public Switch(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public Switch(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }
}