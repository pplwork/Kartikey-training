// declaring what package the file belongs to
package com.reactnativebridgedemo;
// importing various react classes
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.widget.Toast;

public class ToastModule extends ReactContextBaseJavaModule{
    public ToastModule(ReactApplicationContext reactContext){
        super(reactContext);
    }
    // returns name of the native module which represents the class in js
    @Override
    public String getName(){
        return "ToastModule";
    }
    // ReactMethod decorator makes the function available in the javascript world
    @ReactMethod
    public void showToast(String message){
        Toast.makeText(getReactApplicationContext(),message,Toast.LENGTH_SHORT).show();
    }
}