import React, {useEffect} from 'react';
import {StyleSheet, View, NativeModules, Button, StatusBar} from 'react-native';
import Notification from './Notification';
const {Alt, NativeToast} = NativeModules;

const App = () => {
  useEffect(() => {
    Alt.trigger();
  }, []);
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        <Button
          title="Open Native Toast"
          onPress={() => {
            NativeToast.show('This is a kotlin toast', 5);
          }}
        />
        <Notification />
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
