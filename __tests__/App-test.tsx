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
  // https://github.com/facebook/jest/issues/6434#issuecomment-525576660
  jest.useFakeTimers();
  renderer.create(<App />);
});
