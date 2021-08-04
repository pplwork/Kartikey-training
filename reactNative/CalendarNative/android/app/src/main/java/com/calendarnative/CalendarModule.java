package com.calendarnative;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.BaseActivityEventListener;

import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule{
    CalendarModule(ReactApplicationContext context){
        super(context);
    }

    @Override
    public String getName(){
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location,Callback callBack){
        Log.d("CalendarModule","Create event called with name: " + name + " and location: " + location);
        int eventId=1;
        // can only invoke one callback and that too once, so using the format (error,success) -> error=null in our case
        callBack.invoke(null,eventId);
    }

    @ReactMethod
    public void createCalendarEventPromise(String name, String location,Promise promise){
        Log.d("CalendarModule","Create event called with name: " + name + " and location: " + location);
        try{
            int eventId=1;
            promise.resolve(eventId);
        }
        catch(Exception e){
            promise.reject("Create Event Error : ",e);
        }
    }

    // override getconstants to set constant values 
    @Override
    public Map<String, Object> getConstants(){
        final Map<String, Object> constants=new HashMap<>();
        constants.put("Birthday","Nov 11, 2000");
        return constants;
    }

    private void sendEvent(ReactContext context,String eventName, WritableMap params){
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
    // WritableMap params=Arguments.createMap();
    // params.putString("some event","some value");
    // sendEvent(context,"EventReminder",params);
}