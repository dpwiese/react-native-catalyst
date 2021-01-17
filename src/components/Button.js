/**
 * @flow
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    height: 30,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
  row: {
    flexDirection: "row",
  },
});

type Props = {
  onPress: Function,
  text?: string,
};

const Button = (props: Props): React$Element<any> => (
  <TouchableOpacity style={styles.container} onPress={props.onPress}>
    <View style={styles.row}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  </TouchableOpacity>
);

export default Button;

Button.defaultProps = {
  text: undefined,
};
