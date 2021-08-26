import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

const Signup = () => {
  const [loaded] = useFonts({
    InstagramRegular: require("../assets/fonts/regular.otf"),
    InstagramBold: require("../assets/fonts/bold.otf"),
  });
  if (!loaded) return null;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.detailText}>English (United States)</Text>
        <Entypo name="chevron-down" size={16} color="rgba(0,0,0,0.4)" />
      </View>
      <View style={styles.content}>
        <Text style={styles.instagramText}>Instagram</Text>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="facebook" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <View style={styles.divider}>
          <View style={styles.bar}></View>
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.bar}></View>
        </View>
        <View style={styles.signupView}>
          <Text style={styles.signup}>Sign up with email</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.detailText}>
          Don't have an account?<Text style={styles.highlight}> Sign up.</Text>
        </Text>
      </View>
    </View>
  );
};

export default Signup;

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
    marginBottom: 100,
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
  highlight: {
    color: "darkblue",
  },
  detailText: {
    alignSelf: "center",
    marginVertical: 10,
    color: "rgba(0,0,0,0.4)",
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
  },
  content: {
    width: "85%",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  signup: {
    color: "#1890ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupView: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
});
