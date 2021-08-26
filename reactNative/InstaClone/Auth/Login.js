import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((e) => console.log(e));
  };
  if (!loaded) return null;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.detailText}>English (United States)</Text>
        <Entypo name="chevron-down" size={16} color="rgba(0,0,0,0.4)" />
      </View>
      <View style={styles.content}>
        <Text style={styles.instagramText}>Instagram</Text>
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
        <TouchableOpacity style={styles.button} onPress={() => login()}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.detailText}>
          Forgot your login details?{" "}
          <Text style={styles.highlight}>Get help logging in.</Text>
        </Text>
        <View style={styles.divider}>
          <View style={styles.bar}></View>
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.bar}></View>
        </View>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="facebook" size={24} color="white" />
          <Text style={{ ...styles.buttonText, fontWeight: "bold" }}>
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  instagramText: {
    fontFamily: "InstagramRegular",
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
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
  eyeIcon: {
    marginLeft: 15,
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
  detailText: {
    alignSelf: "center",
    marginVertical: 10,
    color: "rgba(0,0,0,0.4)",
  },
  highlight: { color: "darkblue" },
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
  content: {
    width: "85%",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
