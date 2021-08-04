import React, {useEffect} from 'react';
import {
  StyleSheet,
  Button,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const {CalendarModule, ImagePickerModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(CalendarModule);

const App = () => {
  useEffect(() => {
    console.log(CalendarModule.getConstants());
    const listener = eventEmitter.addListener('Reminder', event =>
      console.log(event),
    );
    return () => {
      listener.remove();
    };
  }, []);

  const createCalendarEvent = () => {
    CalendarModule.createCalendarEvent(
      'Async Event',
      'Args Has -> Callback',
      eventId => {
        console.log('In Callback with event id ', eventId);
      },
    );
  };

  const createCalendarEventPromise = () => {
    CalendarModule.createCalendarEventPromise(
      'Async Event',
      'Args Has -> Promise',
    )
      .then(eventId => {
        console.log('In Promise with event id ', eventId);
      })
      .catch(err => {
        console.log('Error Occured in promise', err);
      });
  };

  const imagePicker = () => {
    ImagePickerModule.pickImage().then(stuff => console.log(stuff));
  };

  return (
    <View style={styles.container}>
      <Button
        title="Create Calender Event - Callback"
        onPress={createCalendarEvent}
      />
      <Button
        title="Create Calendar Event - Promise"
        onPress={createCalendarEventPromise}
      />
      <Button title="Image Picker" onPress={imagePicker} />
    </View>
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
