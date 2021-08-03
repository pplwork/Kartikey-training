import React from 'react';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';
const {ToastModule} = NativeModules;
const App=()=>{
    const showToast=()=>{
        ToastModule.showToast("This is a native Toast!");
    }
    return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Button onPress={showToast} title="Toast BTN" />
    </View>
    )
}
export default App;
