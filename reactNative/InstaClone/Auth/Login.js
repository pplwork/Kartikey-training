import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { useFonts } from "expo-font";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [wrongPasswordModalVisible, setWrongPasswordModalVisible] =
    useState(false);
  const [userNotFoundModalVisible, setUserNotFoundModalVisible] =
    useState(false);
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        switch (err.code) {
          case "auth/wrong-password":
            setWrongPasswordModalVisible(true);
            break;
          case "auth/invalid-email":
          case "auth/user-not-found":
            setUserNotFoundModalVisible(true);
            break;
          default:
            return null;
        }
      });
  };
  if (!loaded) return null;
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={userNotFoundModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <View style={styles.modalText}>
              <Text style={styles.modalTextHeading}>Can't Find Account</Text>
              <Text style={styles.modalTextDescription}>
                We can't find an account with {email}. Try another phone number
                or email, or if you don't have an instagram account, you can
                sign up.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => {
                if (pressed)
                  return {
                    ...styles.modalBtn,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  };
                return styles.modalBtn;
              }}
              onPress={() => setUserNotFoundModalVisible(false)}
            >
              <Text style={styles.modalBtnBlue}>Try Again</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => {
                if (pressed)
                  return {
                    ...styles.modalBtn,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  };
                return styles.modalBtn;
              }}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.modalBtnBlack}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongPasswordModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <View style={styles.modalText}>
              <Text style={styles.modalTextHeading}>
                Forgotten password for {email}?
              </Text>
              <Text style={styles.modalTextDescription}>
                You can log in with your linked Facebook account.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => {
                if (pressed)
                  return {
                    ...styles.modalBtn,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  };
                return styles.modalBtn;
              }}
              onPress={() => setWrongPasswordModalVisible(false)}
            >
              <Text style={styles.modalBtnBlue}>Use Facebook</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => {
                if (pressed)
                  return {
                    ...styles.modalBtn,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  };
                return styles.modalBtn;
              }}
              onPress={() => setWrongPasswordModalVisible(false)}
            >
              <Text style={styles.modalBtnBlack}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
        <Text
          style={styles.detailText}
          onPress={() => navigation.navigate("LoginHelp")}
        >
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
        <Text
          style={styles.detailText}
          onPress={() => navigation.navigate("Signup")}
        >
          Don't have an account?
          <Text style={styles.highlight}> Sign up.</Text>
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
  bar: { borderWidth: 0.5, flex: 1, borderColor: "rgba(0,0,0,0.2)" },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalText: {
    padding: 35,
    alignItems: "center",
  },
  modalTextHeading: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 24,
  },
  modalTextDescription: {
    textAlign: "center",
    color: "rgba(0,0,0,0.6)",
    lineHeight: 18,
    fontSize: 14,
  },
  modalBtn: {
    alignItems: "center",
    padding: 15,
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
  },
  modalBtnBlue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1890ff",
  },
  modalBtnBlack: {
    fontSize: 16,
  },
  popup: {
    backgroundColor: "#fff",
    width: "75%",
    borderRadius: 20,
  },
});
