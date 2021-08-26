import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

const SignupDetails = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((e) => console.log(e));
  };
  return (
    <View style={styles.container}>
      <View></View>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <AntDesign name="user" size={128} color="black" />
        </View>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(e) => setEmail(e)}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            placeholder="Password"
            style={{ flex: 1 }}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
          <FontAwesome5
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color={showPassword ? "#1890ff" : "rgba(0,0,0,0.4)"}
            style={styles.eyeIcon}
            onPress={() => {
              setShowPassword((prev) => !prev);
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => signup()}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.divider}>
          <View style={styles.bar}></View>
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.bar}></View>
        </View>
        <TouchableOpacity style={styles.buttonAlt}>
          <FontAwesome5 name="facebook" size={24} color="black" />
          <Text
            style={{ ...styles.buttonText, color: "black", fontWeight: "bold" }}
          >
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.detailText}>
          Don't have an account?<Text style={styles.highlight}> Sign up.</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignupDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    position: "relative",
  },
  content: {
    width: "85%",
    position: "relative",
  },
  avatar: {
    padding: 50,
    borderRadius: 1000,
    borderWidth: 2,
    alignSelf: "center",
    marginVertical: 20,
  },
  inputField: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(250,250,250,1)",
    marginVertical: 10,
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(220,220,220,1)",
    borderRadius: 5,
  },
  buttonAlt: {
    padding: 14,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.6)",
  },
  button: {
    padding: 14,
    backgroundColor: "#1890ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 10,
  },
  eyeIcon: {
    marginLeft: 15,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  bar: { borderWidth: 0.5, flex: 1, borderColor: "rgba(0,0,0,0.4)" },
  dividerText: {
    color: "rgba(0,0,0,0.4)",
    fontWeight: "bold",
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.4)",
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  detailText: {
    alignSelf: "center",
    marginVertical: 10,
    color: "rgba(0,0,0,0.4)",
  },
  highlight: { color: "darkblue" },
});
