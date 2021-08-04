import React from 'react';
import {StyleSheet, Text, View, NativeModules, Button} from 'react-native';

const {NativeNotification} = NativeModules;

const Notification = () => {
  const showNotification = () => {
    NativeNotification.trigger();
  };

  return (
    <View style={{marginVertical: 10}}>
      <Button title="Open Notification" onPress={showNotification} />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({});
