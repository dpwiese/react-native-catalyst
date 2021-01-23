import React, { ReactElement } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});

type Focused = {
  focused?: boolean;
};

type IconProps = React.ComponentProps<typeof Ionicons> & Focused;

export default (props: IconProps): ReactElement => (
  <Ionicons name={props.name} size={20} style={styles.icon} color={props.focused ? "#2f95dc" : "#ccc"} />
);
