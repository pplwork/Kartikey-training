package com.kotlinnative;

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;
import android.app.AlertDialog;
import android.content.Context;

class AlertManager(reactContext:ReactApplicationContext) : ReactContextBaseJavaModule(reactContext){
    private final var TAG="AlertManager";

    override fun getName():String{
        return "Alt"
    }

    @ReactMethod
    fun trigger(){
        Log.d("Alert","Alert was triggered")
    }
}