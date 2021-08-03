import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreenStack/HomeScreen";
import CameraScreen from "./HomeScreenStack/CameraScreen";

const HomeScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="none"
      screenOptions={{ animationEnabled: false }}
    >
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} tabNavigator={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="Camera">
        {(props) => <CameraScreen {...props} tabNavigator={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
const Stack = createStackNavigator();
export default React.memo(HomeScreenStack);
