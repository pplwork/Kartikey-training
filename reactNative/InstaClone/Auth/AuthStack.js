import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from "./Signup";
import SignupDetails from "./SignupDetails";
import Login from "./Login";
import LoginHelp from "./LoginHelp";
import AccessAccount from "./AccessAccount";
import { useDispatch, useSelector } from "react-redux";
import Analytics from "@react-native-firebase/analytics";

const AuthStack = () => {
  const isMounted = useRef(true);
  const navRef = useRef(null);
  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);
  const { screen } = useSelector((state) => state);
  const [helpUser, setHelpUser] = useState("");

  const dispatch = useDispatch();

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
        initialRouteName="Login"
        screenOptions={({ route }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="SignupDetails" component={SignupDetails} />
        <Stack.Screen
          name="LoginHelp"
          options={{
            headerShown: true,
            headerStyle: { elevation: 0, shadowOffset: 0 },
            headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
            headerLeft: null,
            title: "Login Help",
          }}
        >
          {(props) => (
            <LoginHelp
              {...props}
              helpUser={helpUser}
              setHelpUser={setHelpUser}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AccessAccount"
          options={{
            headerShown: true,
            title: "Access Your Account",
            headerStyle: { elevation: 0, shadowOffset: 0 },
            headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
          }}
        >
          {(props) => (
            <AccessAccount
              {...props}
              helpUser={helpUser}
              setHelpUser={setHelpUser}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createStackNavigator();

export default AuthStack;
