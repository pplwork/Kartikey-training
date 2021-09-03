import React, { useEffect, useRef } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs from "./AppTabs";
import AddStoryScreen from "../components/AddStoryScreen";
import AddPostScreen from "../components/AddPostScreen";
import AddPostFinalize from "../components/AddPostFinalize";
import { useDispatch, useSelector } from "react-redux";
import Analytics from "@react-native-firebase/analytics";
import auth from "@react-native-firebase/auth";
import Modal from "react-native-modalbox";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Icons from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import crashlytics from "@react-native-firebase/crashlytics";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const MainStack = () => {
  const navRef = useRef(null);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const {
    screen,
    bottomDrawer,
    selected,
    enableMultiselect,
    multiSelected,
    caption,
  } = useSelector((state) => state);
  const savePost = async () => {
    // create post
    // first upload the files to respective directories
    // add links of uploaded files to firestore post

    //create post and get postid
    let post = await firestore().collection("posts").add({
      caption,
      comments: [],
      content: [],
      likes: [],
      author: auth().currentUser.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    //check if single file upload or multifile
    if (enableMultiselect) {
      let promiseArray = [];
      for (let i = 0; i < multiSelected.length; ++i) {
        // check file type
        let extension = multiSelected[i].match(/.*\.(.+)$/)[1];
        //create ref for video file
        let ref;
        let type;
        if (["m4a", "mp4", "flv", "mkv", "wmv", "mov"].includes(extension)) {
          ref = storage().ref(
            `videos/posts/${auth().currentUser.uid}/${
              post.id
            }/${i}.${extension}`
          );
          type = "video";
        } else {
          ref = storage().ref(
            `images/posts/${auth().currentUser.uid}/${
              post.id
            }/${i}.${extension}`
          );
          type = "image";
        }
        promiseArray.push(
          ref
            .putFile(selected)
            .then(() => {
              post.update({
                content: [
                  {
                    type,
                    source: ref.toString(),
                  },
                ],
              });
            })
            .then(() => {
              // add link to post content
              firestore()
                .collection("users")
                .doc(auth().currentUser.uid)
                .update({
                  Posts: firestore.FieldValue.arrayUnion(post.id),
                });
            })
        );
      }
      await Promise.all([...promiseArray]);
    } else {
      // check file type
      let extension = selected.match(/.*\.(.+)$/)[1];
      //create ref for video file
      let ref;
      let type;
      if (["m4a", "mp4", "flv", "mkv", "wmv", "mov"].includes(extension)) {
        ref = storage().ref(
          `videos/posts/${auth().currentUser.uid}/${post.id}/0.${extension}`
        );
        type = "video";
      } else {
        ref = storage().ref(
          `images/posts/${auth().currentUser.uid}/${post.id}/0.${extension}`
        );
        type = "image";
      }
      // upload file
      await ref.putFile(selected);
      // add link to post content
      await post.update({
        content: [
          {
            type,
            source: ref.toString(),
          },
        ],
      });
      await firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          Posts: firestore.FieldValue.arrayUnion(post.id),
        });
    }
  };

  useEffect(() => {
    crashlytics().log("Updating User Data from Server");
    const unsubscribe = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot(
        (doc) => {
          const data = doc.data();
          storage()
            .refFromURL(data.Photo)
            .getDownloadURL()
            .then((url) => {
              data.Photo = url;
              dispatch({
                type: "SET_USER",
                payload: data,
              });
            })
            .catch(crashlytics().recordError);
        },
        (err) => {
          crashlytics().recordError(err);
        }
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (bottomDrawer.visible) modalRef.current.open();
    else modalRef.current.close();
  }, [bottomDrawer]);
  return (
    <>
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
          screenOptions={({ route }) => ({
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
          })}
        >
          <Stack.Screen name="AddStoryScreen" component={AddStoryScreen} />
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen
            name="AddPostScreen"
            component={AddPostScreen}
            options={({ navigation }) => ({
              headerShown: true,
              title: "New Post",
              headerBackImage: () => (
                <AntDesign name="close" size={32} color="black" />
              ),
              headerRight: () => (
                <AntDesign
                  name="arrowright"
                  size={32}
                  color="#1890ff"
                  onPress={() => {
                    if (selected != "") navigation.navigate("AddPostFinalize");
                  }}
                />
              ),
              headerRightContainerStyle: {
                paddingRight: 10,
              },
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
            })}
          />
          <Stack.Screen
            name="AddPostFinalize"
            component={AddPostFinalize}
            options={({ navigation }) => ({
              headerShown: true,
              title: "New Post",
              headerRight: () => (
                <Pressable
                  onPress={() =>
                    savePost().then(() => navigation.navigate("AppTabs"))
                  }
                  style={({ pressed }) => {
                    if (pressed)
                      return {
                        backgroundColor: "#DFDFDF",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        padding: 5,
                      };
                    return {
                      backgroundColor: "#FFF",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                      padding: 5,
                    };
                  }}
                >
                  <AntDesign name="check" size={32} color="#1890ff" />
                </Pressable>
              ),
              headerRightContainerStyle: {
                paddingRight: 10,
              },
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Modal
        ref={modalRef}
        swipeToClose={true}
        onClosed={() => dispatch({ type: "CLOSE_DRAWER" })}
        position="bottom"
        backdropPressToClose={true}
        backdropColor="black"
        backdropOpacity={0.2}
        style={{
          height: bottomDrawer.content.length * 57,
          backgroundColor: "#fff",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.bar}></View>
          {bottomDrawer.content.map((ele) => {
            const Icon = Icons[ele.icon.library];
            return (
              <Pressable
                style={({ pressed }) => ({
                  ...styles.modalListItem,
                  backgroundColor: pressed ? "#DFDFDF" : "#fff",
                })}
                onPress={ele.action}
                key={ele.icon.name}
              >
                <Icon
                  name={ele.icon.name}
                  size={ele.icon.size}
                  color={ele.icon.color}
                />
                <Text style={styles.modalListItemText}>{ele.item}</Text>
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
};

const Stack = createStackNavigator();

export default MainStack;

const styles = StyleSheet.create({
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  bar: {
    height: 5,
    width: 80,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 40,
    alignSelf: "center",
    marginVertical: 10,
  },
  modalListItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalListItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
