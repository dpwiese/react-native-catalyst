import "react-native-gesture-handler";
import React, { ReactElement } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import base64, { decode as _atob, encode as _btoa } from "base-64";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import SettingsScreen from "./src/screens/SettingsScreen";
import TabBarIcon from "./src/components/TabBarIcon";
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
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Home",
              tabBarIcon: ({ focused }): ReactElement => {
                return <TabBarIcon focused={focused} name="md-home" />;
              },
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: "Settings",
              tabBarIcon: ({ focused }): ReactElement => {
                return <TabBarIcon focused={focused} name="md-settings-outline" />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};
