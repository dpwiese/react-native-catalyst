import "react-native-gesture-handler";
import { StatusBar, StyleSheet, View } from "react-native";
import base64, { decode as _atob, encode as _btoa } from "base-64";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import SettingsScreen from "./src/screens/SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

if (!globalAny.atob) {
  globalAny.atob = base64.decode;
}

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default (): ReactElement => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};
