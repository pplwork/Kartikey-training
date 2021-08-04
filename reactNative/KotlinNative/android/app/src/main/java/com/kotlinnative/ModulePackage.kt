package com.kotlinnative;

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.*

class ModulePackage:ReactPackage{

    override fun createNativeModules(reactContext:ReactApplicationContext):ArrayList<NativeModule>{
        var modules=ArrayList<NativeModule>()
        modules.add(AlertManager(reactContext))
        modules.add(NativeToast(reactContext))
        modules.add(NativeNotification(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext:ReactApplicationContext):List<ViewManager<*,*>>{
        return Collections.emptyList<ViewManager<*,*>>()
    }
}