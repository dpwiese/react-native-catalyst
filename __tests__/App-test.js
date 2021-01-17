/**
 * @format
 */

import "react-native";
import App from "../App";
import React from "react";

jest.mock("react-native-ble-plx");

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  renderer.create(<App />);
});
