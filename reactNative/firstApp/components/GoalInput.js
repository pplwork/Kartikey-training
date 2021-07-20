import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Modal } from "react-native";
const GoalInput = ({
  setGoal,
  goal,
  addGoal,
  modalVisible,
  setModalVisible,
}) => {
  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Course Goal"
          style={styles.textInput}
          value={goal}
          onChangeText={(e) => setGoal(e)}
        />
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <Button title="Add" onPress={addGoal} />
          </View>
          <View style={styles.button}>
            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoalInput;

const styles = StyleSheet.create({
  textInput: {
    width: "80%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    marginTop: 10,
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "40%",
  },
});
