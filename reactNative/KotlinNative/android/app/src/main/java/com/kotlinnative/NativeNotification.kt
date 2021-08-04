package com.kotlinnative

import android.app.Notification
import android.app.NotificationChannel
import android.util.Log
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import android.graphics.Color
import android.content.Context
import com.facebook.react.bridge.ReactMethod

class NativeNotification:ReactContextBaseJavaModule{

    var loading:Boolean=false;
    lateinit var notificationManager: NotificationManager
    lateinit var notificationChannel: NotificationChannel
    lateinit var notificationBuilder: Notification.Builder
    var channelId: String = "pplwork"
    lateinit var myContext:ReactApplicationContext

    constructor(context:ReactApplicationContext): super(context){
        this.loading=true
        this.myContext=context
    }

    override fun getName(): String{
        return "NativeNotification"
    }

    @ReactMethod fun trigger(){
        val notificationChannel=NotificationChannel(channelId,"My Notifications", NotificationManager.IMPORTANCE_HIGH)
        notificationChannel.setDescription("Channel Description");
        notificationChannel.enableLights(true)
        notificationChannel.setLightColor(Color.RED)
        notificationChannel.enableVibration(true)

        // register channel with android
        notificationManager=myContext.getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(notificationChannel)
        
        if(this.loading){
            val notificationBuilder:NotificationCompat.Builder=NotificationCompat.Builder(myContext,channelId)
            notificationBuilder.setAutoCancel(true).setWhen(System.currentTimeMillis()).setSmallIcon(R.drawable.round).setTicker("Wot").setContentTitle("Notification Title").setContentText("Notification Title").setContentInfo("Info")
            notificationManager.notify(1234,notificationBuilder.build())
        }
    }

}