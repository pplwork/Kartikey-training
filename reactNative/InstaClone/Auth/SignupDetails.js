import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";

const SignupDetails = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const dispatch = useDispatch();
  const signup = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((e) => {
        dispatch({ type: "SET_USER", action: e.user });
        navigation.navigate("Login");
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            setModalTitle("This Email is on Another Account");
            setModalDescription(
              "You can log into the account associated with that email or you can use that email to make a new account"
            );
            setModalVisible(true);
            break;
          case "auth/invalid-email":
            setModalTitle("Invalid Email");
            setModalDescription("Please enter a valid email address");
            setModalVisible(true);
            break;
          case "auth/weak-password":
            setModalTitle("Weak Password");
            setModalDescription(
              "Please enter a strong password (use mixed upper,lower,number,special characters)"
            );
            setModalVisible(true);
            break;
          default:
            return null;
        }
      });
  };
  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <View style={styles.modalText}>
              <Text style={styles.modalTextHeading}>{modalTitle}</Text>
              <Text style={styles.modalTextDescription}>
                {modalDescription}
              </Text>
            </View>
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
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnBlack}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
        <Text
          style={styles.detailText}
          onPress={() => navigation.navigate("Login")}
        >
          Already have an account?<Text style={styles.highlight}> Log in.</Text>
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
  detailText: {
    alignSelf: "center",
    marginVertical: 10,
    color: "rgba(0,0,0,0.4)",
  },
  highlight: { color: "darkblue" },
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
