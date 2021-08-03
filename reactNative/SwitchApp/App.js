import React from 'react';
import {StyleSheet,View,requireNativeComponent} from 'react-native';

const Switch=requireNativeComponent('Switch');

const App=()=>{
return(
<View style={styles.container}>
    <Switch style={styles.javaBtn} isTurnedOn={true}/>
</View>
)
}

export default App;

const styles=StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  javaBtn: {
    height: 100,
    width: 300,
    backgroundColor: 'yellow',
  },
})