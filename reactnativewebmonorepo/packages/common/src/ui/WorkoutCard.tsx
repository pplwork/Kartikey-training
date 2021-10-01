import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { observer } from "mobx-react-lite";
import Card from "./Card";
interface Props {
  exercise: string;
  repsAndWeight: string;
  sets: string[];
  onSetPress(index: number): void;
}

const WorkoutCard: React.FC<Props> = observer(
  ({ exercise, repsAndWeight, sets, onSetPress }) => {
    return (
      <View style={styles.cardContainer}>
        <Card>
          <View style={styles.topRow}>
            <Text style={styles.topRowText}>{exercise}</Text>
            <Text style={styles.topRowText}>{repsAndWeight}</Text>
          </View>
          <View style={styles.bottomRow}>
            {sets.map((set, index) => {
              if (set === "x")
                return (
                  <View
                    style={[styles.circle, styles.fadedBackground]}
                    key={index}
                  >
                    <Text style={(styles.circleText, styles.grayText)}>X</Text>
                  </View>
                );
              if (set == "")
                return (
                  <TouchableOpacity
                    onPress={() => onSetPress(index)}
                    style={[styles.circle, styles.fadedBackground]}
                    key={index}
                  />
                );
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.circle}
                  onPress={() => onSetPress(index)}
                >
                  <Text style={[styles.whiteText, styles.circleText]}>
                    {set}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      </View>
    );
  }
);

export default WorkoutCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topRowText: {
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    borderRadius: 50,
    backgroundColor: "#8fb299",
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteText: {
    color: "#fff",
  },
  circleText: {
    fontSize: 16,
  },
  fadedBackground: {
    backgroundColor: "#B2A1A1",
  },
  grayText: {
    color: "#655252",
  },
});
