import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";

import GoalInput from "./components/GoalInput";
import GoalItems from "./components/GoalItems";

export default function App() {
  const [goal, setGoal] = useState("");
  const [goalList, setGoalList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const addGoal = () => {
    if (goal.trim().length == 0) {
      return;
    }
    setGoalList((prev) => [
      ...prev,
      { goal: goal.trim(), key: Math.random().toString() },
    ]);
    setGoal("");
    setModalVisible(false);
  };

  const deleteHandler = (key) => {
    setGoalList((prev) => prev.filter((goal) => goal.key != key));
  };

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Button title="Add Goal" onPress={() => setModalVisible(true)} />
        <GoalInput
          setGoal={setGoal}
          addGoal={addGoal}
          goal={goal}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <GoalItems goalList={goalList} deleteHandler={deleteHandler} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
  },
  textInput: {
    width: "80%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
  },
  inputContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  goalsContainer: {
    marginTop: 20,
  },
  goalItem: {
    backgroundColor: "#24A0ED",
    padding: 10,
    marginVertical: 10,
    borderRadius: 3,
  },
});
