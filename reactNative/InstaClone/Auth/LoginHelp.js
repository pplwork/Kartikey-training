import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";

const LoginHelp = ({ navigation, helpUser, setHelpUser }) => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const checkAndRedirect = async () => {
    let user = await firestore()
      .collection("users")
      .where("Email", "==", helpUser)
      .get();
    if (user.empty) setErrorModalVisible(true);
    else {
      setHelpUser(user.docs[0].data());
      navigation.navigate("AccessAccount");
    }
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <View style={styles.modalText}>
              <Text style={styles.modalTextHeading}>User Not Found!</Text>
              <Text style={styles.modalTextDescription}>
                Please check the entered email address.
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
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.modalBtnBlack}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.h1}>Find Your Account</Text>
          <Text style={styles.h2}>
            Enter your email linked to your account.
          </Text>
          <View style={styles.input}>
            <TextInput
              value={helpUser}
              placeholder="Enter Email"
              onChangeText={(e) => setHelpUser(e)}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={checkAndRedirect}>
            <Text style={{ ...styles.buttonText, fontWeight: "bold" }}>
              Next
            </Text>
          </TouchableOpacity>
          <View style={styles.divider}>
            <View style={styles.bar}></View>
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.bar}></View>
          </View>
          <View style={styles.loginWithFacebook}>
            <FontAwesome5 name="facebook" size={24} color="#1890ff" />
            <Text style={styles.blueText}>Login with Facebook</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={{ ...styles.blueText, fontWeight: "400", fontSize: 14 }}>
            Need more help?
          </Text>
        </View>
      </View>
    </>
  );
};

export default LoginHelp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  main: {
    width: "80%",
  },
  h1: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    color: "rgb(0,0,0)",
  },
  h2: {
    fontSize: 14,
    textAlign: "center",
    color: "rgba(0,0,0,0.6)",
  },
  input: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(250,250,250,1)",
    marginTop: 30,
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(220,220,220,1)",
    borderRadius: 5,
  },
  button: {
    padding: 14,
    backgroundColor: "#1890ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 10,
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
  loginWithFacebook: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  blueText: {
    marginLeft: 10,
    color: "#1890ff",
    fontWeight: "bold",
    fontSize: 16,
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
