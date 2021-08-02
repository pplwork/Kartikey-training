import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreenStack/HomeScreen";
import CameraScreen from "./HomeScreenStack/CameraScreen";

const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="none"
      screenOptions={{ animationEnabled: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="Camera" component={CameraScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};
const Stack = createStackNavigator();
export default React.memo(HomeScreenStack);
