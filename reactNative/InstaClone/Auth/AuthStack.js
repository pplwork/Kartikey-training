import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from "./Signup";
import SignupDetails from "./SignupDetails";
import Login from "./Login";
import LoginHelp from "./LoginHelp";
import AccessAccount from "./AccessAccount";
import auth from "@react-native-firebase/auth";
import { useDispatch, useSelector } from "react-redux";
const AuthStack = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => (isMounted.current = false);
  });
  const { user, isLoggedIn, screen } = useSelector((state) => state);
  const [helpUser, setHelpUser] = useState("");
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch();
  const onAuthStateChanged = (user) => {
    console.log("authstatechanged", user);
    dispatch({ type: "SET_USER", payload: user });
    if (initializing) setInitializing(false);
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;
  return (
    <NavigationContainer>
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
