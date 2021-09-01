import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
const AccessAccount = ({ navigation, helpUser, setHelpUser }) => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);
  const [mailSent, setMailSent] = useState(false);
  const sendResetEmail = () => {
    auth()
      .sendPasswordResetEmail(helpUser.Email)
      .then(() => setMailSent(true));
  };
  const [pfpURI, setPfpURI] = useState("");
  useEffect(() => {
    console.log(helpUser);
    storage()
      .refFromURL(helpUser.Photo)
      .getDownloadURL()
      .then((url) => setPfpURI(url));
  }, [helpUser]);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.photo}>
          {pfpURI !== "" && (
            <Image style={styles.photo} source={{ uri: pfpURI }} />
          )}
        </View>
        <Text style={styles.username}>{helpUser.Username}</Text>
        <View style={styles.listItem}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="black"
          />
          <Text style={styles.listDescription} onPress={() => sendResetEmail()}>
            Send an Email
          </Text>
          {mailSent && (
            <AntDesign
              name="checkcircle"
              size={24}
              color="green"
              style={{ marginLeft: "auto" }}
            />
          )}
        </View>
        {/* <View style={styles.listItem}>
          <MaterialIcons name="smartphone" size={24} color="black" />
          <Text style={styles.listDescription}>Send a SMS</Text>
        </View> */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="facebook" size={24} color="black" />
          <Text style={styles.listDescription}>Log in with Facebook</Text>
        </View>
      </View>
    </View>
  );
};

export default AccessAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  photo: {
    height: 100,
    width: 100,
    backgroundColor: "#DFDFDF",
    borderRadius: 100,
    marginVertical: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  username: {
    textTransform: "uppercase",
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 50,
  },
  listItem: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  listDescription: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    width: "90%",
  },
});
