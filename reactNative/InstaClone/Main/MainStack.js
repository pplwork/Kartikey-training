import React, { useRef } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./AppTabs";
import AddStoryScreen from "../components/AddStoryScreen";
import { useDispatch, useSelector } from "react-redux";
import Analytics from "@react-native-firebase/analytics";

const MainStack = () => {
  const navRef = useRef(null);
  const dispatch = useDispatch();
  const { screen } = useSelector((state) => state);
  return (
    <NavigationContainer
      ref={navRef}
      onStateChange={(e) => {
        const prevRoute = screen;
        const curRoute = navRef.current.getCurrentRoute().name;
        if (prevRoute != curRoute) {
          Analytics().logScreenView({
            screen_class: curRoute,
            screen_name: curRoute,
          });
          dispatch({
            type: "SET_SCREEN",
            payload: navRef.current.getCurrentRoute().name,
          });
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="AppTabs"
        screenOptions={(route) => ({
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}
      >
        <Stack.Screen name="AddStoryScreen" component={AddStoryScreen} />
        <Stack.Screen name="AppTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createStackNavigator();

export default MainStack;
