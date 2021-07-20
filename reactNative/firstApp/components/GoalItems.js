import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const GoalItems = ({ goalList, deleteHandler }) => {
  return (
    <FlatList
      data={goalList}
      renderItem={(itemData) => (
        <TouchableOpacity onLongPress={() => deleteHandler(itemData.item.key)}>
          <View style={styles.goalItem}>
            <Text style={{ color: "white" }}>{itemData.item.goal}</Text>
          </View>
        </TouchableOpacity>
      )}
      style={styles.goalsContainer}
    />
  );
};

export default GoalItems;

const styles = StyleSheet.create({
  goalsContainer: {
    marginTop: 20,
  },
  goalItem: {
    backgroundColor: "#24A0ED",
    padding: 10,
    marginVertical: 10,
    borderRadius: 3,
    borderWidth: 1,
  },
});
